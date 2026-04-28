import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, ComposedChart, Area, ReferenceLine, ScatterChart, Scatter, ZAxis, Legend,
} from "recharts";

// ============================================================
//  BRANDING ROCKSTAR DATA
// ============================================================
const RS = {
  primary: "#3B1F6E",
  primaryDark: "#1A1A2E",
  primaryMid: "#4A2680",
  gold: "#E8C96D",
  goldDark: "#C9A84C",
  lavender: "#F5F3FA",
  lavenderMid: "#EEE9F8",
  purpleSoft: "#8870AA",
  white: "#FFFFFF",
  text: "#555555",
  textLight: "#888888",
  green: "#4CAF50",
  red: "#F44336",
  orange: "#FF9800",
};

const CITY_COLORS = {
  Bilbao: RS.primary,
  Burgos: RS.purpleSoft,
  Donosti: RS.red,
  Pamplona: RS.orange,
  Vitoria: RS.green,
  Zaragoza: RS.gold,
};

const FONT = "Arial, Helvetica, sans-serif";

// ============================================================
//  DATA (cumulativo Ene 2025 — Abr 2026, fecha corte 26/04/2026)
// ============================================================
const ALL_MONTHS = ["2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04"];
const MONTH_LABEL = {
  "2025-01":"Ene 25","2025-02":"Feb 25","2025-03":"Mar 25","2025-04":"Abr 25","2025-05":"May 25","2025-06":"Jun 25",
  "2025-07":"Jul 25","2025-08":"Ago 25","2025-09":"Sep 25","2025-10":"Oct 25","2025-11":"Nov 25","2025-12":"Dic 25",
  "2026-01":"Ene 26","2026-02":"Feb 26","2026-03":"Mar 26","2026-04":"Abr 26",
};

const CITIES = ["Bilbao","Burgos","Donosti","Pamplona","Vitoria","Zaragoza"];

const SUMMARY = {
  Bilbao:   { ventas: 361929.23, ventas_total: 398127.86, caja_neto: -1153.86, caja_falta: -1889.80, caja_sobra: 735.94, caja_dias_neg: 23,  caja_registros: 443, fact_count: 26,  fact_value: 1418.26,  prod_antes_count: 607, prod_antes_value: 6766.80, prod_cocina_count: 683, prod_cocina_value: 7224.90, prod_facturar_count: 267, prod_facturar_value: 2548.45, merma_value: 902.60, merma_items: 167 },
  Burgos:   { ventas: 302396.41, ventas_total: 332639.79, caja_neto: -3113.90, caja_falta: -5370.93, caja_sobra: 2257.03, caja_dias_neg: 59, caja_registros: 444, fact_count: 4,   fact_value: 324.50,   prod_antes_count: 162, prod_antes_value: 2239.50, prod_cocina_count: 397, prod_cocina_value: 4163.85, prod_facturar_count: 51,  prod_facturar_value: 436.25,  merma_value: 11.69,   merma_items: 19  },
  Donosti:  { ventas: 477301.78, ventas_total: 525032.44, caja_neto: -25595.31, caja_falta: -38842.42, caja_sobra: 13247.11, caja_dias_neg: 143, caja_registros: 420, fact_count: 24, fact_value: 1263.24, prod_antes_count: 679, prod_antes_value: 9822.70, prod_cocina_count: 948, prod_cocina_value: 11289.75, prod_facturar_count: 391, prod_facturar_value: 4385.97, merma_value: 76.27, merma_items: 31 },
  Pamplona: { ventas: 658603.99, ventas_total: 724469.91, caja_neto: -12501.42, caja_falta: -14106.05, caja_sobra: 1604.63, caja_dias_neg: 108, caja_registros: 486, fact_count: 337, fact_value: 20895.59, prod_antes_count: 930, prod_antes_value: 16673.65, prod_cocina_count: 1466, prod_cocina_value: 16671.05, prod_facturar_count: 639, prod_facturar_value: 108180.95, merma_value: 625.85, merma_items: 189 },
  Vitoria:  { ventas: 342272.33, ventas_total: 376500.41, caja_neto: -6167.26, caja_falta: -9157.03, caja_sobra: 2989.77, caja_dias_neg: 61, caja_registros: 457, fact_count: 11, fact_value: 593.90, prod_antes_count: 331, prod_antes_value: 4745.70, prod_cocina_count: 300, prod_cocina_value: 3426.20, prod_facturar_count: 83, prod_facturar_value: 841.00, merma_value: 804.32, merma_items: 196 },
  Zaragoza: { ventas: 485902.26, ventas_total: 534492.66, caja_neto: -4340.24, caja_falta: -8260.98, caja_sobra: 3920.74, caja_dias_neg: 78, caja_registros: 474, fact_count: 47, fact_value: 2991.79, prod_antes_count: 1020, prod_antes_value: 9834.60, prod_cocina_count: 1456, prod_cocina_value: 18514.35, prod_facturar_count: 565, prod_facturar_value: 4827.25, merma_value: 266.56, merma_items: 122 },
};

const CAJA_MONTHLY = {
  Bilbao:[-170.29,40.27,0,1.90,-89.94,-1082.85,281.13,-28.69,3.75,-104.37,0.03,0,0,-0.01,0.01,-4.80],
  Burgos:[-685.07,69.25,-388.93,69.61,-239.87,58.71,-399.96,19.81,-10.31,122.50,170.66,-1857.14,-536.67,206.47,99.42,187.62],
  Donosti:[0,-3444.16,-3382.16,-7678.87,-2688.68,-1630.97,-5234.10,-4150.83,-189.73,313.79,260.90,66.90,900.68,22.06,545.30,694.56],
  Pamplona:[-1699.93,-1741.71,-0.16,-320.75,-3057.76,-337.89,179.38,118.98,-605.27,-916.50,-596.94,-1696.01,-613.15,-847.32,-215.85,-150.54],
  Vitoria:[0,0.06,-58.77,222.51,-744.95,-1275.15,-123.99,-1137.39,972.08,-1386.95,32.51,-258.44,-2057.01,-0.40,-357.48,6.11],
  Zaragoza:[-53.11,-214.65,69.11,-477.10,-148.98,-1989.44,-67.20,-922.18,-152.30,2071.26,-1034.19,-323.70,-445.15,-191.31,-293.25,-168.05],
};

// fact_monthly: count y value por mes y ciudad
const FACT_MONTHLY = {
  Bilbao:[[0,0],[1,61.75],[1,5.30],[2,316.70],[1,129],[0,0],[5,69.26],[0,0],[1,59.50],[0,0],[1,36],[2,37.75],[2,38.50],[7,531.20],[2,75.30],[1,58]],
  Burgos:[[0,0],[0,0],[0,0],[1,80.25],[2,119.50],[0,0],[0,0],[1,124.75],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
  Donosti:[[0,0],[3,100],[2,198.20],[2,74.50],[2,87],[2,84],[2,100.29],[1,17],[0,0],[0,0],[0,0],[0,0],[1,66.50],[2,28.85],[6,470.90],[1,36]],
  Pamplona:[[12,557.25],[4,228.75],[17,495.89],[8,3079.25],[49,2906.55],[28,1161.37],[22,1214.35],[22,1196.20],[23,1009],[37,2172.25],[23,1351.97],[17,1106.01],[21,1023.60],[21,1184],[17,1444.15],[16,765]],
  Vitoria:[[0,0],[1,2.45],[0,0],[0,0],[0,0],[2,126.50],[5,332.95],[0,0],[1,81],[1,16],[0,0],[0,0],[0,0],[0,0],[0,0],[1,35]],
  Zaragoza:[[0,0],[1,6],[1,212.40],[0,0],[2,121.50],[10,614],[9,432.65],[0,0],[1,16.50],[1,55],[3,106.99],[2,97.25],[8,470.75],[6,774.75],[0,0],[3,84]],
};

// prod_monthly: [antes_v, cocina_v, facturar_v, antes_c, cocina_c, facturar_c]
const PROD_MONTHLY = {
  Bilbao:[[170.75,389,219.75,25,37,14],[250.50,406,138.25,24,28,12],[471.15,477,74.30,41,44,8],[455.05,248.05,84.80,37,27,17],[211.70,584.85,87.50,35,47,11],[197.75,655.50,172,26,60,21],[839.45,309.65,380.35,53,47,43],[443.45,927.05,205.95,60,92,19],[740,1036.95,202.10,38,80,25],[983,647.75,355.50,66,62,30],[209.50,565.75,156.10,20,52,18],[276.75,328.75,125.30,23,27,11],[521.25,126,92.45,42,14,12],[398.15,114.50,42.50,39,15,6],[211.75,109.75,74.85,32,12,7],[386.60,298.35,136.75,46,39,13]],
  Burgos:[[171.50,143.50,19.50,14,16,2],[53.75,182.75,50,11,18,10],[251.75,354.15,94.55,27,43,10],[402.50,589.05,31.20,21,62,3],[138,237,91.50,7,18,6],[69,264.25,6,8,24,2],[200,396,16,17,32,2],[143.25,231.50,4.75,12,20,1],[68,181,5,3,17,2],[110,253,61.50,5,25,8],[157,290,38.50,9,27,3],[254.50,203.50,0,11,20,0],[184.75,229.65,17.75,14,22,2],[18,357.25,0,1,30,0],[17.50,114,0,2,12,0],[0,137.25,0,0,11,0]],
  Donosti:[[0,0,0,0,0,0],[1573.35,1656.90,423.35,124,144,39],[2239.30,1035.30,503.70,163,91,63],[452.70,1741.95,210.80,33,121,30],[241.10,705.95,472.30,22,68,28],[85,1504.40,235,15,74,14],[265.70,881.20,183.05,20,94,28],[445.50,600.55,160.30,27,65,17],[402.30,454.80,78.45,19,52,10],[169,294.55,19.50,14,33,2],[271.10,586,316.10,24,51,29],[1251.75,200.55,163.25,60,18,11],[194.50,601.75,130.60,12,45,11],[443.15,155.45,313.95,28,18,26],[1103.80,459,949.80,61,51,58],[684.45,411.40,225.82,57,23,25]],
  Pamplona:[[281.75,583.25,482,31,45,43],[1095.50,461.50,740.25,77,34,54],[3787.75,783.25,206.25,48,70,16],[432.45,1405.50,605.25,38,137,52],[1479.55,1641.10,1602.05,79,129,90],[525,1391.70,466.30,56,117,55],[509.65,544.60,281.05,60,71,28],[814.90,1964.15,100282.05,60,172,32],[663.10,1124.75,598.35,46,104,43],[2078.05,1230.25,1283.10,116,112,91],[926.50,1235.40,567.50,58,111,34],[756.75,774.70,126,59,79,3],[1600.35,984.35,132.60,73,84,18],[632.10,468.30,195.70,38,43,24],[628.75,1347.90,309.25,46,90,25],[461.50,730.35,303.25,45,68,31]],
  Vitoria:[[137.25,58.50,59,21,6,7],[167.50,234,41.50,10,24,3],[118.75,334.25,161.50,15,29,16],[87.50,283.70,168.25,10,25,13],[10,129.15,0,3,11,0],[307,425.95,11.50,17,38,4],[433.25,359.50,7.50,27,30,2],[918.50,221.75,61.50,53,23,8],[246.50,266.75,39,19,22,7],[326.50,190.50,98,24,19,7],[745.25,201.70,54,38,11,3],[263,241.50,71.50,18,19,5],[204.50,168.95,8,18,15,1],[307.50,132.50,0,25,10,0],[337.70,145.75,0,20,13,0],[135,31.75,59.75,13,5,7]],
  Zaragoza:[[277.40,628.40,131.50,22,52,14],[209.70,562.90,82.10,25,52,9],[572.90,1067.70,74.40,54,75,9],[159.60,2945.75,73.70,31,91,10],[296.80,1066.95,351.50,55,110,47],[346.55,911.50,471.55,67,85,62],[797.75,991.85,204,75,92,22],[1049.05,1336.40,461.95,96,145,64],[406.90,555.95,564.50,60,79,70],[1859.05,2569.25,973.20,212,269,120],[1492.20,2348.75,448.10,81,87,36],[367.95,1251.25,173.95,58,114,27],[728.75,731.45,404.35,44,63,30],[606.35,631,82,54,50,8],[327.90,325.30,257.20,41,37,22],[335.75,589.95,73.25,45,55,15]],
};

// Índice 0..15 = Ene25, Feb25, Mar25, Abr25, May25, Jun25, Jul25, Ago25, Sep25, Oct25, Nov25, Dic25, Ene26, Feb26, Mar26, Abr26
const MERMAS_MONTHLY = {
  Bilbao:[0,0,0,0,0,0,0,44.62,23.42,66.85,0,97.50,382.44,89.77,82.42,115.58],
  Burgos:[0,0,0,0,0,0,0,0,0,0,11.69,0,0,0,0,0],
  Donosti:[0,0,0,0,0,0,0,0,0,0,0,0,76.27,0,0,0],
  Pamplona:[0,0,0,0,0,0,0,0,152.60,136.82,67.71,0,80.94,91.12,35.50,61.16],
  Vitoria:[0,0,0,0,0,0,0,0,0,0,281.33,195.66,0,208.50,51.77,67.06],
  Zaragoza:[0,0,0,0,0,0,0,0,0,0,107.02,143.12,0,16.42,0,0],
};

// DESVIACIONES — ahora por local por mes (export desde T-Spoon archivo individual). Cobertura mejorada.
const DESVIACIONES = [
  { mes: "Ago 25", monthKey: "2025-08", value: 7150.55,    by_local: { Bilbao: 5633.40, Burgos: 1517.15 }, locales: ["Bilbao","Burgos"] },
  { mes: "Sep 25", monthKey: "2025-09", value: 14975.97,   by_local: { Bilbao: 10016.49, Pamplona: 7454.98, Zaragoza: 3955.40, Donosti: 2386.35, Burgos: -78.45, Vitoria: -8758.80 }, locales: ["Bilbao","Burgos","Donosti","Pamplona","Vitoria","Zaragoza"] },
  { mes: "Oct 25", monthKey: "2025-10", value: 29249.69,   by_local: { Zaragoza: 10177.59, Pamplona: 9177.97, Burgos: 7316.21, Vitoria: 2577.92 }, locales: ["Burgos","Pamplona","Vitoria","Zaragoza"] },
  { mes: "Nov 25", monthKey: "2025-11", value: -57712.49,  by_local: { Zaragoza: 10041.82, Pamplona: 9813.80, Burgos: 1862.86, Vitoria: -79430.97 }, locales: ["Burgos","Pamplona","Vitoria","Zaragoza"] },
  { mes: "Dic 25", monthKey: "2025-12", value: 136969.05,  by_local: { Vitoria: 117355.69, Burgos: 10311.63, Pamplona: 5567.99, Bilbao: 2004.69, Donosti: 1729.05 }, locales: ["Bilbao","Burgos","Donosti","Pamplona","Vitoria"] },
  { mes: "Ene 26", monthKey: "2026-01", value: 7602.98,    by_local: { Pamplona: 6355.23, Vitoria: 4668.70, Donosti: 1101.83, Bilbao: 833.30, Burgos: -5356.08 }, locales: ["Bilbao","Burgos","Donosti","Pamplona","Vitoria"] },
  { mes: "Feb 26", monthKey: "2026-02", value: 11211.38,   by_local: { Burgos: 5688.65, Donosti: 2628.23, Bilbao: 1477.73, Pamplona: 1133.88, Vitoria: 282.89 }, locales: ["Bilbao","Burgos","Donosti","Pamplona","Vitoria"] },
  { mes: "Mar 26", monthKey: "2026-03", value: -7706.30,   by_local: { Vitoria: -340.08, Donosti: -1738.07, Bilbao: -1896.54, Pamplona: -3731.61 }, locales: ["Bilbao","Donosti","Pamplona","Vitoria"] },
];

const TOP_EMP_FACTURAS = [
  { name: "ARIANNE",   city: "Pamplona", count: 198, value: 13396.03 },
  { name: "UNAX",      city: "Pamplona", count: 85,  value: 5295.50 },
  { name: "IÑAKI",     city: "Pamplona", count: 29,  value: 1203.44 },
  { name: "KEVIN",     city: "Zaragoza", count: 15,  value: 1186.25 },
  { name: "LEA",       city: "Pamplona", count: 25,  value: 1000.62 },
  { name: "JUDITH",    city: "Zaragoza", count: 13,  value: 847.60 },
  { name: "SERGIO",    city: "Zaragoza", count: 11,  value: 604.45 },
  { name: "GABRIEL",   city: "Vitoria",  count: 10,  value: 591.45 },
  { name: "GABRIELLA", city: "Donosti",  count: 7,   value: 506.90 },
  { name: "IGOR",      city: "Bilbao",   count: 11,  value: 465.45 },
];

const TOP_EMP_PROD_FACTURAR = [
  { name: "ARIANNE",   city: "Pamplona", count: 321, value: 104419.65, value_sin_outlier: 4419.65 },
  { name: "SERGIO",    city: "Zaragoza", count: 294, value: 2376.90 },
  { name: "SANTI",     city: "Donosti",  count: 205, value: 2323.60 },
  { name: "IÑAKI",     city: "Pamplona", count: 134, value: 1769.80 },
  { name: "UNAX",      city: "Pamplona", count: 116, value: 1430.35 },
  { name: "GABRIELLA", city: "Donosti",  count: 80,  value: 1119.62 },
  { name: "JOSE",      city: "Bilbao",   count: 92,  value: 818.15 },
  { name: "KEVIN",     city: "Zaragoza", count: 63,  value: 687.70 },
  { name: "IGOR",      city: "Bilbao",   count: 63,  value: 606.85 },
  { name: "DASNEL",    city: "Donosti",  count: 61,  value: 579.75 },
];

// Outlier detectado: 1 registro de 100.000€ el 29/08/2025 por ARIANNE en Pamplona ("Atención por 2 bellezones")
const OUTLIER = { fecha: "29/08/2025", city: "Pamplona", employee: "ARIANNE", product: "Atención por 2 bellezones", value: 100000.00 };

// Cobertura de mermas: meses con datos reales registrados por local (T-Spoon)
const MERMAS_COVERAGE = {
  Bilbao:   { hasta: "Abr 26", missing: ["Nov 25"] },
  Burgos:   { hasta: "Nov 25", missing: ["Ago 25","Sep 25","Oct 25","Dic 25","Ene 26","Feb 26","Mar 26","Abr 26"] },
  Donosti:  { hasta: "Ene 26", missing: ["Ago 25","Sep 25","Oct 25","Nov 25","Dic 25","Feb 26","Mar 26","Abr 26"] },
  Pamplona: { hasta: "Abr 26", missing: ["Ago 25","Dic 25"] },
  Vitoria:  { hasta: "Abr 26", missing: ["Ago 25","Sep 25","Oct 25","Ene 26"] },
  Zaragoza: { hasta: "Feb 26", missing: ["Ago 25","Sep 25","Oct 25","Ene 26","Mar 26","Abr 26"] },
};

// ============================================================
//  HELPERS
// ============================================================
// Inserta el separador de miles "." cada 3 dígitos en la parte entera (es-ES no agrupa números de 4 cifras por defecto).
const _group = (intStr) => intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const fmt = (n) => {
  if (n === undefined || n === null || isNaN(n)) return "—";
  const fixed = Math.abs(n).toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  return (n < 0 ? "-" : "") + _group(intPart) + "," + decPart + " €";
};
const fmtShort = (n) => {
  if (n === undefined || n === null || isNaN(n)) return "—";
  if (Math.abs(n) >= 1000) {
    const v = n / 1000;
    const fixed = Math.abs(v).toFixed(1);
    const [intPart, decPart] = fixed.split(".");
    return (v < 0 ? "-" : "") + _group(intPart) + "," + decPart + "k €";
  }
  const r = Math.round(n);
  return (r < 0 ? "-" : "") + _group(String(Math.abs(r))) + " €";
};
const fmtPct = (n, decimals = 2) => {
  if (n === undefined || n === null || isNaN(n)) return "—";
  const fixed = Math.abs(n).toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  return (n < 0 ? "-" : "") + _group(intPart) + (decPart !== undefined ? "," + decPart : "") + " %";
};
const fmtInt = (n) => {
  if (n === undefined || n === null || isNaN(n)) return "—";
  const r = Math.round(n);
  return (r < 0 ? "-" : "") + _group(String(Math.abs(r)));
};

// ============================================================
//  PERIOD FILTER LOGIC
// ============================================================
const PERIOD_OPTIONS = [
  { value: "all",   label: "Periodo completo (Ene 25 — Abr 26)" },
  { value: "2025",  label: "Año 2025" },
  { value: "2026",  label: "Año 2026 (YTD Abr)" },
  { value: "2026-04", label: "Solo Abril 2026" },
  { value: "2026-03", label: "Solo Marzo 2026" },
  { value: "2026-02", label: "Solo Febrero 2026" },
  { value: "2026-01", label: "Solo Enero 2026" },
];

function monthsInPeriod(period) {
  if (period === "all") return ALL_MONTHS;
  if (period === "2025") return ALL_MONTHS.filter(m => m.startsWith("2025"));
  if (period === "2026") return ALL_MONTHS.filter(m => m.startsWith("2026"));
  return [period]; // single month
}

function aggregateByCity(monthlyDataObj, monthsKept, accessor = (v) => v) {
  // monthlyDataObj: { city: [val_per_month] } where index aligns with ALL_MONTHS
  const result = {};
  CITIES.forEach(city => {
    const arr = monthlyDataObj[city] || [];
    let sum = 0;
    monthsKept.forEach(m => {
      const idx = ALL_MONTHS.indexOf(m);
      if (idx >= 0 && arr[idx] !== undefined) {
        sum += accessor(arr[idx]);
      }
    });
    result[city] = sum;
  });
  return result;
}

// ============================================================
//  UI COMPONENTS
// ============================================================

// Tooltip hover — para explicar términos a profesionales del sector restauración.
// Reglas RockStar: máx ~80 caracteres, formato Acción + Definición, sin punto final.
const Hover = ({ children, text, inline = false }) => {
  const [open, setOpen] = useState(false);
  const wrap = inline ? "inline-flex" : "inline-flex";
  return (
    <span
      style={{ display: wrap, alignItems: "center", gap: 4, position: "relative", cursor: "help" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      <span
        aria-label={text}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 14, height: 14, borderRadius: 7,
          background: RS.gold, color: RS.primaryDark,
          fontSize: 9, fontWeight: 800, fontFamily: FONT,
          lineHeight: 1, marginLeft: 2,
        }}
      >i</span>
      {open && (
        <span
          style={{
            position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
            transform: "translateX(-50%)",
            background: RS.primaryDark, color: RS.white,
            padding: "8px 12px", borderRadius: 6,
            fontSize: 11, fontWeight: 500, fontFamily: FONT,
            whiteSpace: "normal", width: 260, textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            borderTop: `2px solid ${RS.gold}`,
            zIndex: 1000, lineHeight: 1.4, pointerEvents: "none",
          }}
        >
          {text}
          <span
            style={{
              position: "absolute", top: "100%", left: "50%",
              transform: "translateX(-50%)",
              width: 0, height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: `6px solid ${RS.primaryDark}`,
            }}
          />
        </span>
      )}
    </span>
  );
};

const Card = ({ children, style = {}, className = "" }) => (
  <div
    className={className}
    style={{
      background: RS.white,
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(59,31,110,0.08)",
      border: `1px solid ${RS.lavenderMid}`,
      padding: 20,
      ...style,
    }}
  >
    {children}
  </div>
);

const KPI = ({ label, value, sub, color = RS.text, accent, tooltip }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 11, color: RS.textLight, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {tooltip ? <Hover text={tooltip}><span>{label}</span></Hover> : label}
    </div>
    <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: RS.textLight, marginTop: 4 }}>{sub}</div>}
    {accent && <div style={{ marginTop: 6 }}>{accent}</div>}
  </div>
);

const Badge = ({ children, color = RS.primary, bg }) => (
  <span style={{
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    background: bg || `${color}22`,
    color,
    fontFamily: FONT,
  }}>{children}</span>
);

const SectionTitle = ({ icon, title, subtitle, tooltip }) => (
  <div style={{ marginBottom: 18, marginTop: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: RS.primary, margin: 0, fontFamily: FONT, display: "flex", alignItems: "center" }}>
        {tooltip ? <Hover text={tooltip}><span>{title}</span></Hover> : title}
      </h2>
    </div>
    {subtitle && <p style={{ fontSize: 13, color: RS.textLight, margin: "6px 0 0 36px", fontFamily: FONT }}>{subtitle}</p>}
  </div>
);

const Alert = ({ type = "info", children }) => {
  const styles = {
    warning: { bg: "#FFF8E1", border: RS.orange, txt: "#7A4F00" },
    danger:  { bg: "#FFEBEE", border: RS.red,    txt: "#7A0000" },
    info:    { bg: RS.lavender, border: RS.primary, txt: RS.primary },
    success: { bg: "#E8F5E9", border: RS.green, txt: "#1B5E20" },
  };
  const icons = { warning: "⚠️", danger: "🚨", info: "ℹ️", success: "✅" };
  const s = styles[type];
  return (
    <div style={{
      background: s.bg,
      borderLeft: `4px solid ${s.border}`,
      borderRadius: 6,
      padding: 12,
      margin: "12px 0",
      fontSize: 13,
      color: s.txt,
      fontFamily: FONT,
      display: "flex",
      alignItems: "flex-start",
      gap: 8,
    }}>
      <span style={{ flexShrink: 0, lineHeight: 1.4 }}>{icons[type]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
};

const RSTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: RS.white, border: `1px solid ${RS.purpleSoft}`, borderRadius: 8,
      boxShadow: "0 4px 12px rgba(59,31,110,0.15)", padding: 10, fontSize: 12, fontFamily: FONT,
    }}>
      {label !== undefined && <div style={{ fontWeight: 700, color: RS.primary, marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: p.color, display: "inline-block" }} />
          <span style={{ color: RS.text }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: RS.primary }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ============================================================
//  HEADER + FILTER BAR
// ============================================================
const Header = ({ period, setPeriod, section, setSection, sections }) => (
  <div style={{ position: "sticky", top: 0, zIndex: 20, background: RS.primary, color: RS.white, fontFamily: FONT }}>
    {/* Top brand bar */}
    <div style={{ background: RS.primaryDark, padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${RS.gold}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          fontWeight: 900, fontSize: 18, letterSpacing: 1, color: RS.gold,
        }}>ROCKSTAR DATA</span>
        <span style={{ fontSize: 11, color: RS.purpleSoft, letterSpacing: 2 }}>|  CONFIDENCIAL</span>
      </div>
      <div style={{ fontSize: 11, color: RS.purpleSoft }}>
        Datos hasta 26/04/2026 · v.Abril 2026
      </div>
    </div>

    {/* Title + period filter */}
    <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 0.5 }}>
          INFORME DE ANÁLISIS DE FRAUDE
        </div>
        <div style={{ fontSize: 12, color: RS.gold, marginTop: 2 }}>
          PallaPizza S.L. — Isla Sicilia · 6 locales · Fuentes: Last.app + T-Spoon Lab
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: RS.gold, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Periodo:</span>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{
            background: RS.white, color: RS.primary, fontWeight: 600, fontSize: 12,
            padding: "6px 12px", borderRadius: 6, border: `1px solid ${RS.gold}`,
            cursor: "pointer", fontFamily: FONT,
          }}
        >
          {PERIOD_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>
    </div>

    {/* Tabs */}
    <div style={{ background: RS.primaryMid, padding: "0 24px", display: "flex", gap: 4, overflowX: "auto" }}>
      {sections.map((s, i) => (
        <button
          key={i}
          onClick={() => setSection(i)}
          style={{
            padding: "10px 16px",
            background: section === i ? RS.gold : "transparent",
            color: section === i ? RS.primaryDark : RS.white,
            border: "none",
            borderTop: section === i ? `3px solid ${RS.gold}` : "3px solid transparent",
            fontWeight: section === i ? 700 : 500,
            fontSize: 13,
            cursor: "pointer",
            whiteSpace: "nowrap",
            fontFamily: FONT,
          }}
        >
          {s.label}
        </button>
      ))}
    </div>
  </div>
);

// ============================================================
//  SECTION 1: RESUMEN
// ============================================================
const Section1_Resumen = ({ months }) => {
  const cajaTotal = CITIES.reduce((s, c) => s + months.reduce((a, m) => a + (CAJA_MONTHLY[c][ALL_MONTHS.indexOf(m)] || 0), 0), 0);
  const factTotal = CITIES.reduce((s, c) => s + months.reduce((a, m) => a + (FACT_MONTHLY[c][ALL_MONTHS.indexOf(m)]?.[1] || 0), 0), 0);
  const factCount = CITIES.reduce((s, c) => s + months.reduce((a, m) => a + (FACT_MONTHLY[c][ALL_MONTHS.indexOf(m)]?.[0] || 0), 0), 0);
  const prodFactTotal = CITIES.reduce((s, c) => s + months.reduce((a, m) => a + (PROD_MONTHLY[c][ALL_MONTHS.indexOf(m)]?.[2] || 0), 0), 0);
  const mermaTotal = CITIES.reduce((s, c) => s + months.reduce((a, m) => a + (MERMAS_MONTHLY[c][ALL_MONTHS.indexOf(m)] || 0), 0), 0);
  // Ventas totales: solo disponibles en cumulativo. Mostrar como dato de referencia.
  const ventasTotal = CITIES.reduce((s, c) => s + SUMMARY[c].ventas, 0);
  const pctMerma = ventasTotal > 0 ? (mermaTotal / ventasTotal) * 100 : 0;

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: RS.primary, margin: 0, fontFamily: FONT, letterSpacing: 0.5 }}>RESUMEN EJECUTIVO</h1>
        <p style={{ fontSize: 13, color: RS.textLight, marginTop: 6, fontFamily: FONT }}>
          Análisis de los tres vectores principales de posible fraude: descuadres de caja, anulaciones (facturas-tickets / productos) y desviaciones de inventario.
        </p>
      </div>

      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          <KPI label="Descuadre de caja (neto)" value={fmt(cajaTotal)} color={RS.red} sub={`6 locales · ${months.length} mes(es)`}
            tooltip="Suma de faltas y sobras al cuadrar caja vs. lo esperado por TPV" />
          <KPI label="Facturas-Tickets eliminados" value={fmt(factTotal)} color={RS.orange} sub={`${factCount} tickets`}
            tooltip="Tickets emitidos en TPV y posteriormente anulados del sistema" />
          <KPI label="Productos elim. tras facturar" value={fmt(prodFactTotal)} color={RS.red} sub="Indicador crítico"
            tooltip="Productos ya cobrados al cliente y borrados después del sistema" />
          <KPI label="Mermas registradas" value={fmt(mermaTotal)} color={RS.green} sub="Periodo seleccionado"
            tooltip="Coste de producto desechado o caducado registrado en T-Spoon"
            accent={<Badge color={RS.orange}>{fmtPct(pctMerma, 3)} sobre ventas</Badge>} />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: RS.primary, margin: "0 0 12px 0", fontFamily: FONT }}>Vectores analizados</h3>
          <div style={{ fontSize: 13, color: RS.text, lineHeight: 1.6, fontFamily: FONT }}>
            <p style={{ margin: "8px 0" }}><strong style={{ color: RS.primary }}>1. Descuadres de caja:</strong> diferencia entre efectivo esperado por TPV y efectivo real contado.</p>
            <p style={{ margin: "8px 0" }}><strong style={{ color: RS.primary }}>2. Anulaciones:</strong> facturas-tickets eliminados tras emitirse y productos eliminados de comandas (antes/después de cocina, después de facturar).</p>
            <p style={{ margin: "8px 0" }}><strong style={{ color: RS.primary }}>3. Desviaciones de inventario:</strong> diferencia entre consumo teórico (escandallos × ventas) y consumo real (stock), por almacén y mes.</p>
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: RS.primary, margin: "0 0 12px 0", fontFamily: FONT }}>Cobertura del periodo</h3>
          <div style={{ fontSize: 12, color: RS.text, fontFamily: FONT, lineHeight: 1.7 }}>
            <p style={{ margin: 0 }}>· <strong>Caja, facturas-tickets y productos:</strong> cobertura completa para los 6 locales (Last.app).</p>
            <p style={{ margin: "6px 0 0 0" }}>· <strong>Mermas (T-Spoon):</strong> cobertura desigual — Bilbao, Pamplona y Vitoria llegan a Abril; Donosti hasta Feb; Burgos y Zaragoza solo agregado 2025.</p>
            <p style={{ margin: "6px 0 0 0" }}>· <strong>Desviaciones de almacén:</strong> registros mensuales Ago25—Mar26 con cobertura variable de locales por mes. No se entrega archivo de Abril 26.</p>
            <p style={{ margin: "6px 0 0 0", color: RS.textLight, fontStyle: "italic" }}>Donde no hay dato es porque el cliente no lo ha registrado en el sistema en el periodo correspondiente.</p>
          </div>
        </Card>
      </div>

      <Alert type="danger">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 8, flexWrap: "wrap" }}>
          <strong>Hallazgos críticos — periodo completo</strong>
          <Badge color={RS.purpleSoft}>No se actualiza con el filtro</Badge>
        </div>
        (1) Donosti acumula -25.595 € de descuadre concentrado en Feb—Ago 2025; (2) Pamplona concentra el 75 % de las facturas-tickets eliminados (337 de 449), con ARIANNE acumulando 198 (13.396 €); (3) Detectado un registro de 100.000 € en productos eliminados tras facturar en Pamplona el 29/08/2025 (ARIANNE) — registro NO REAL (probable broma del equipo o prueba), distorsiona el indicador.
      </Alert>
    </div>
  );
};

// ============================================================
//  SECTION 2: CAJA
// ============================================================
const Section2_Caja = ({ months, period }) => {
  const [view, setView] = useState("multi"); // "multi" o single city name

  // Recalculate totals per city for the selected period
  const totalsPerCity = useMemo(() => {
    const out = {};
    CITIES.forEach(city => {
      let neto = 0, falta = 0, sobra = 0;
      months.forEach(m => {
        const v = CAJA_MONTHLY[city][ALL_MONTHS.indexOf(m)] || 0;
        neto += v;
        if (v < 0) falta += v;
        else if (v > 0) sobra += v;
      });
      out[city] = { neto, falta, sobra };
    });
    return out;
  }, [months]);

  // Bar chart data: falta vs sobra by city
  const barData = CITIES.map(city => ({
    city,
    falta: Math.abs(totalsPerCity[city].falta),
    sobra: totalsPerCity[city].sobra,
    neto: totalsPerCity[city].neto,
  }));

  // Line chart data: por mes, una línea por ciudad O una sola
  const lineData = months.map(m => {
    const obj = { month: MONTH_LABEL[m] };
    CITIES.forEach(city => {
      obj[city] = CAJA_MONTHLY[city][ALL_MONTHS.indexOf(m)] || 0;
    });
    return obj;
  });

  return (
    <div>
      <SectionTitle icon="💰" title="Descuadres de caja" subtitle={`Diferencia entre efectivo esperado (TPV) y efectivo real contado · ${months.length} mes(es) en el filtro`} />

      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 16 }}>
          {CITIES.map(city => {
            const t = totalsPerCity[city];
            const color = t.neto < -5000 ? RS.red : t.neto < -1000 ? RS.orange : RS.text;
            return (
              <div key={city} style={{ textAlign: "center", padding: 10, background: RS.lavender, borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: RS.purpleSoft, fontFamily: FONT }}>{city}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color, fontFamily: FONT }}>{fmtShort(t.neto)}</div>
                <div style={{ fontSize: 10, color: RS.textLight, fontFamily: FONT }}>neto</div>
              </div>
            );
          })}
        </div>

        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={RS.lavenderMid} />
              <XAxis dataKey="city" tick={{ fontSize: 12, fill: RS.text, fontFamily: FONT }} />
              <YAxis tick={{ fontSize: 11, fill: RS.text, fontFamily: FONT }} tickFormatter={fmtShort} />
              <Tooltip content={<RSTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: FONT }} />
              <Bar dataKey="falta" name="Falta en caja" fill={RS.red} radius={[6,6,0,0]} />
              <Bar dataKey="sobra" name="Sobra en caja" fill={RS.green} radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Alert type={Math.abs(totalsPerCity.Donosti.neto) > 10000 ? "danger" : "warning"}>
        <strong>Donosti</strong> presenta el mayor descuadre acumulado del periodo. El problema se concentró entre febrero y agosto 2025 (-28.000 €). Desde septiembre 2025 el descuadre prácticamente desaparece (saldo positivo acumulado), lo que sugiere que algo cambió (cambio de empleado, procedimiento o control implementado). En abril 2026, todos los locales muestran un saldo prácticamente neutro o positivo, salvo Pamplona y Zaragoza con descuadres negativos puntuales.
      </Alert>

      <Card style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: RS.primary, margin: 0, fontFamily: FONT }}>Evolución mensual del descuadre</h3>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <button
              onClick={() => setView("multi")}
              style={{
                padding: "5px 10px", fontSize: 11, fontWeight: 600, borderRadius: 6,
                background: view === "multi" ? RS.primary : RS.lavender, color: view === "multi" ? RS.white : RS.primary,
                border: "none", cursor: "pointer", fontFamily: FONT,
              }}>
              Todas las ciudades
            </button>
            {CITIES.map(c => (
              <button key={c} onClick={() => setView(c)}
                style={{
                  padding: "5px 10px", fontSize: 11, fontWeight: 600, borderRadius: 6,
                  background: view === c ? CITY_COLORS[c] : RS.lavender,
                  color: view === c ? RS.white : RS.text, border: "none", cursor: "pointer", fontFamily: FONT,
                }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            {view === "multi" ? (
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={RS.lavenderMid} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: RS.text, fontFamily: FONT }} />
                <YAxis tick={{ fontSize: 11, fill: RS.text, fontFamily: FONT }} tickFormatter={fmtShort} />
                <Tooltip content={<RSTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: FONT }} />
                <ReferenceLine y={0} stroke={RS.purpleSoft} strokeDasharray="3 3" />
                {CITIES.map(c => (
                  <Line key={c} type="monotone" dataKey={c} stroke={CITY_COLORS[c]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                ))}
              </LineChart>
            ) : (
              <ComposedChart data={lineData.map(d => ({ month: d.month, value: d[view] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={RS.lavenderMid} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: RS.text, fontFamily: FONT }} />
                <YAxis tick={{ fontSize: 11, fill: RS.text, fontFamily: FONT }} tickFormatter={fmtShort} />
                <Tooltip content={<RSTooltip />} />
                <ReferenceLine y={0} stroke={RS.purpleSoft} strokeDasharray="3 3" />
                <Bar dataKey="value" name={view}>
                  {lineData.map((d, i) => <Cell key={i} fill={d[view] < 0 ? RS.red : RS.green} />)}
                </Bar>
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

// ============================================================
//  SECTION 3: FACTURAS-TICKETS ELIMINADOS
// ============================================================
const Section3_Facturas = ({ months }) => {
  const totalsPerCity = useMemo(() => {
    const out = {};
    CITIES.forEach(city => {
      let count = 0, value = 0;
      months.forEach(m => {
        const idx = ALL_MONTHS.indexOf(m);
        if (FACT_MONTHLY[city][idx]) {
          count += FACT_MONTHLY[city][idx][0];
          value += FACT_MONTHLY[city][idx][1];
        }
      });
      out[city] = { count, value };
    });
    return out;
  }, [months]);

  const barData = CITIES.map(city => ({ city, value: totalsPerCity[city].value, count: totalsPerCity[city].count }));
  const totalCount = barData.reduce((s, d) => s + d.count, 0);
  const totalValue = barData.reduce((s, d) => s + d.value, 0);
  const pctPamp = totalCount > 0 ? (totalsPerCity.Pamplona.count / totalCount) * 100 : 0;

  return (
    <div>
      <SectionTitle icon="🧾" title="Facturas-Tickets eliminados" subtitle={`Tickets emitidos en TPV y posteriormente anulados — ${months.length} mes(es) en el filtro`} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: RS.primary, margin: "0 0 12px 0", fontFamily: FONT }}>Importe por local</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={RS.lavenderMid} />
                <XAxis type="number" tick={{ fontSize: 11, fill: RS.text, fontFamily: FONT }} tickFormatter={fmtShort} />
                <YAxis type="category" dataKey="city" tick={{ fontSize: 11, fill: RS.text, fontFamily: FONT }} width={75} />
                <Tooltip content={<RSTooltip />} />
                <Bar dataKey="value" name="Importe" radius={[0,6,6,0]}>
                  {barData.map((d, i) => (
                    <Cell key={i} fill={d.value > 5000 ? RS.red : d.value > 1000 ? RS.orange : RS.primary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: RS.textLight, textAlign: "center", fontFamily: FONT }}>
            Total: {fmtInt(totalCount)} facturas-tickets · {fmt(totalValue)}
          </div>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: RS.primary, margin: 0, fontFamily: FONT }}>Top empleados</h3>
            <Badge color={RS.purpleSoft}>Periodo completo · no se actualiza con el filtro</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: FONT }}>
            {TOP_EMP_FACTURAS.map((e, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 18, fontSize: 11, color: RS.textLight, textAlign: "right", fontWeight: 700 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: RS.text }}>{e.name}</span>
                    <Badge color={CITY_COLORS[e.city]}>{e.city}</Badge>
                  </div>
                  <div style={{ width: "100%", background: RS.lavender, borderRadius: 4, height: 6, marginTop: 3 }}>
                    <div style={{
                      width: `${Math.min(100, (e.value / TOP_EMP_FACTURAS[0].value) * 100)}%`,
                      height: "100%", borderRadius: 4,
                      background: e.value > 5000 ? RS.red : e.value > 1000 ? RS.orange : RS.primary,
                    }} />
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 90 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: RS.text }}>{fmt(e.value)}</div>
                  <div style={{ fontSize: 10, color: RS.textLight }}>{e.count} tickets</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Alert type="danger">
        <strong>Pamplona concentra el {fmtPct(pctPamp, 1)}</strong> de todas las facturas-tickets eliminados del periodo seleccionado. <span style={{ color: RS.purpleSoft, fontStyle: "italic" }}>(Datos del top empleados que siguen son del periodo completo)</span>: ARIANNE acumula 198 tickets eliminados por valor de 13.396 € en el periodo completo (Ene 25 — Abr 26). UNAX la sigue con 85 (5.296 €). Esta concentración en un solo local y dos personas es anómala y requiere investigación interna.
      </Alert>
    </div>
  );
};

// ============================================================
//  SECTION 4: PRODUCTOS ELIMINADOS
// ============================================================
const Section4_Productos = ({ months }) => {
  const totals = useMemo(() => {
    const out = {};
    CITIES.forEach(city => {
      let antes = 0, cocina = 0, facturar = 0, antesC = 0, cocinaC = 0, facturarC = 0;
      months.forEach(m => {
        const idx = ALL_MONTHS.indexOf(m);
        const r = PROD_MONTHLY[city][idx];
        if (r) {
          antes += r[0]; cocina += r[1]; facturar += r[2];
          antesC += r[3]; cocinaC += r[4]; facturarC += r[5];
        }
      });
      out[city] = { antes, cocina, facturar, antesC, cocinaC, facturarC };
    });
    return out;
  }, [months]);

  const barData = CITIES.map(city => ({
    city,
    "Antes de cocina": totals[city].antes,
    "Después de cocina": totals[city].cocina,
    "Después de facturar": totals[city].facturar,
  }));

  const sumAntes    = CITIES.reduce((s, c) => s + totals[c].antes, 0);
  const sumCocina   = CITIES.reduce((s, c) => s + totals[c].cocina, 0);
  const sumFacturar = CITIES.reduce((s, c) => s + totals[c].facturar, 0);
  const cAntes    = CITIES.reduce((s, c) => s + totals[c].antesC, 0);
  const cCocina   = CITIES.reduce((s, c) => s + totals[c].cocinaC, 0);
  const cFacturar = CITIES.reduce((s, c) => s + totals[c].facturarC, 0);

  // Outlier flag para Pamplona si mes Ago 25 está incluido
  const includesOutlier = months.includes("2025-08");

  return (
    <div>
      <SectionTitle icon="🍕" title="Productos eliminados" subtitle="Productos borrados de comandas en distintas fases del servicio" />

      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 18 }}>
          <div style={{ background: RS.lavender, padding: 14, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: RS.purpleSoft, fontWeight: 700, fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Hover text="Producto eliminado de la comanda antes de enviarlo a cocina">
                <span>ANTES DE COCINA</span>
              </Hover>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: RS.primary, fontFamily: FONT }}>{fmtInt(cAntes)}</div>
            <div style={{ fontSize: 11, color: RS.textLight, fontFamily: FONT }}>{fmt(sumAntes)}</div>
          </div>
          <div style={{ background: "#FFF3E0", padding: 14, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: RS.orange, fontWeight: 700, fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Hover text="Producto ya elaborado por cocina y eliminado antes de facturar">
                <span>DESPUÉS DE COCINA</span>
              </Hover>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#E65100", fontFamily: FONT }}>{fmtInt(cCocina)}</div>
            <div style={{ fontSize: 11, color: RS.textLight, fontFamily: FONT }}>{fmt(sumCocina)}</div>
          </div>
          <div style={{ background: "#FFEBEE", padding: 14, borderRadius: 10, textAlign: "center", border: `1px solid ${RS.red}33` }}>
            <div style={{ fontSize: 11, color: RS.red, fontWeight: 700, fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Hover text="Producto cobrado al cliente y borrado del sistema tras la venta">
                <span>DESPUÉS DE FACTURAR ⚠</span>
              </Hover>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#7A0000", fontFamily: FONT }}>{fmtInt(cFacturar)}</div>
            <div style={{ fontSize: 11, color: RS.textLight, fontFamily: FONT }}>{fmt(sumFacturar)}</div>
          </div>
        </div>

        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke={RS.lavenderMid} />
              <XAxis dataKey="city" tick={{ fontSize: 12, fill: RS.text, fontFamily: FONT }} />
              <YAxis tick={{ fontSize: 11, fill: RS.text, fontFamily: FONT }} tickFormatter={fmtShort} />
              <Tooltip content={<RSTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: FONT }} />
              <Bar dataKey="Antes de cocina" fill={RS.primary} radius={[4,4,0,0]} />
              <Bar dataKey="Después de cocina" fill={RS.orange} radius={[4,4,0,0]} />
              <Bar dataKey="Después de facturar" fill={RS.red} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {includesOutlier && (
        <Alert type="danger">
          <strong>⚠ Registro NO REAL detectado:</strong> El periodo seleccionado incluye Agosto 2025, donde existe 1 registro de <strong>{fmt(OUTLIER.value)}</strong> el {OUTLIER.fecha} ({OUTLIER.city} · {OUTLIER.employee} · "{OUTLIER.product}") en la categoría "Productos eliminados después de facturar". <strong>Este registro NO corresponde a una operación real de venta</strong>: muy probablemente es una broma interna del equipo, una prueba de testing o un ejemplo introducido a propósito en el sistema. Distorsiona toda la métrica de Pamplona en este indicador y debe excluirse del análisis. El valor real de Pamplona en este indicador es <strong>{fmt(SUMMARY.Pamplona.prod_facturar_value - OUTLIER.value)}</strong> (vs los {fmt(SUMMARY.Pamplona.prod_facturar_value)} aparentes si se incluye el registro).
        </Alert>
      )}

      <Alert type="warning">
        Los <strong>productos eliminados después de facturar</strong> son los más críticos: el producto ya se preparó, se sirvió y se facturó, pero luego se eliminó del sistema. Esto puede indicar que se cobró al cliente (en efectivo) y después se borró la venta para quedarse con el dinero. Excluyendo el outlier de Pamplona, los locales con mayor volumen de este indicador en el periodo completo son <strong>Zaragoza ({fmt(SUMMARY.Zaragoza.prod_facturar_value)})</strong> y <strong>Donosti ({fmt(SUMMARY.Donosti.prod_facturar_value)})</strong>.
      </Alert>

      <Alert type="info">
        <strong>Nota sobre la trazabilidad del dato — discrepancia detectada en Last.app:</strong> durante el QA hemos cruzado el sumatorio del detalle de productos eliminados después de cocina con el campo "totales" que el propio Last.app expone, y aparecen pequeñas diferencias. Ejemplo concreto: en <strong>Donosti, marzo 2026</strong>, el sumatorio del detalle de productos eliminados después de cocina arroja <strong>459,00 €</strong>, mientras que el total que registra Last.app para ese mismo concepto y mes es <strong>464,65 €</strong> (diferencia de 5,65 €). Esto <strong>no es un error de cálculo del dashboard</strong> — el dashboard suma correctamente lo que entrega el detalle del export. La discrepancia viene del propio Last.app entre su tabla de detalle y su tabla agregada, y debe ser revisada y corregida en origen por el cliente. Lo dejamos documentado por transparencia en el QA y para que el cliente pueda abrir ticket con Last.app.
      </Alert>

      <Card style={{ marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: RS.primary, margin: 0, fontFamily: FONT }}>
            Top empleados — productos eliminados después de facturar
          </h3>
          <Badge color={RS.purpleSoft}>Periodo completo · no se actualiza con el filtro</Badge>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: FONT }}>
          {TOP_EMP_PROD_FACTURAR.slice(0, 8).map((e, i) => {
            const isOutlier = e.name === "ARIANNE";
            const displayValue = isOutlier ? e.value_sin_outlier : e.value;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 18, fontSize: 11, color: RS.textLight, textAlign: "right", fontWeight: 700 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: RS.text }}>{e.name}</span>
                    <Badge color={CITY_COLORS[e.city]}>{e.city}</Badge>
                    {isOutlier && <Badge color={RS.red} bg="#FFEBEE">Excl. outlier 100k</Badge>}
                  </div>
                  <div style={{ width: "100%", background: RS.lavender, borderRadius: 4, height: 6, marginTop: 3 }}>
                    <div style={{
                      width: `${Math.min(100, (displayValue / 5000) * 100)}%`,
                      height: "100%", borderRadius: 4,
                      background: displayValue > 2000 ? RS.red : displayValue > 500 ? RS.orange : RS.primary,
                    }} />
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 100 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: RS.text }}>{fmt(displayValue)}</div>
                  <div style={{ fontSize: 10, color: RS.textLight }}>{e.count} productos</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ============================================================
//  SECTION 5: MERMAS
// ============================================================
const Section5_Mermas = ({ months }) => {
  const totalsPerCity = useMemo(() => {
    const out = {};
    CITIES.forEach(city => {
      let v = 0;
      months.forEach(m => { v += MERMAS_MONTHLY[city][ALL_MONTHS.indexOf(m)] || 0; });
      out[city] = v;
    });
    return out;
  }, [months]);

  const totalMermas = CITIES.reduce((s, c) => s + totalsPerCity[c], 0);
  // Ventas: cumulativas, no se filtran por periodo
  const totalVentas = CITIES.reduce((s, c) => s + SUMMARY[c].ventas, 0);
  const pctGlobal = totalVentas > 0 ? (totalMermas / totalVentas) * 100 : 0;

  return (
    <div>
      <SectionTitle icon="🗑️" title="Mermas registradas" subtitle="Producto desechado/caducado registrado en T-Spoon Lab — Cobertura desigual por local" />

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <div style={{ background: "#E8F5E9", padding: 12, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: RS.green, fontWeight: 700, fontFamily: FONT }}>MERMAS REGISTRADAS</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1B5E20", fontFamily: FONT }}>{fmt(totalMermas)}</div>
            <div style={{ fontSize: 10, color: RS.textLight, fontFamily: FONT }}>Periodo seleccionado</div>
          </div>
          <div style={{ background: RS.lavender, padding: 12, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: RS.purpleSoft, fontWeight: 700, fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Hover text="Ingresos sin IVA, tras descuentos, en el periodo seleccionado">
                <span>VENTA NETA (TAXABLE BASE)</span>
              </Hover>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: RS.primary, fontFamily: FONT }}>{fmt(totalVentas)}</div>
            <div style={{ fontSize: 10, color: RS.textLight, fontFamily: FONT }}>Cumulativo Ene 25 — Abr 26 (no filtrable)</div>
          </div>
          <div style={{ background: "#FFEBEE", padding: 12, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: RS.red, fontWeight: 700, fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Hover text="Mermas registradas / Venta neta. Esperado quinta gama: 0,5 % — 2 %">
                <span>% MERMA / VENTAS</span>
              </Hover>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#7A0000", fontFamily: FONT }}>{fmtPct(pctGlobal, 3)}</div>
            <div style={{ fontSize: 10, color: RS.textLight, fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <span>Esperado</span>
              <Hover text="Cocina con producto industrial precocinado, listo para regenerar">
                <span style={{ textDecoration: "underline dotted" }}>quinta gama</span>
              </Hover>
              <span>: 0,5 % — 2 %</span>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: RS.primary, margin: "0 0 12px 0", fontFamily: FONT }}>Mermas por local — periodo seleccionado</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: FONT }}>
            {CITIES.map(city => {
              const v = totalsPerCity[city];
              const ventasCity = SUMMARY[city].ventas;
              const pct = ventasCity > 0 ? (v / ventasCity) * 100 : 0;
              const cov = MERMAS_COVERAGE[city];
              return (
                <div key={city} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <div style={{ width: 90, fontWeight: 700, color: RS.text }}>{city}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ background: RS.lavender, borderRadius: 4, height: 8 }}>
                      <div style={{
                        width: `${Math.min(100, (v / 1500) * 100)}%`,
                        height: "100%", borderRadius: 4,
                        background: CITY_COLORS[city],
                      }} />
                    </div>
                    {cov.missing.length > 0 && (
                      <div style={{ fontSize: 10, color: RS.orange, marginTop: 2 }}>
                        Sin datos en: {cov.missing.join(", ")}
                      </div>
                    )}
                  </div>
                  <div style={{ width: 90, textAlign: "right", color: RS.text, fontWeight: 700 }}>{fmt(v)}</div>
                  <div style={{ width: 60, textAlign: "right", color: RS.textLight, fontSize: 11 }}>{fmtPct(pct, 3)}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: RS.primary, margin: "0 0 12px 0", fontFamily: FONT }}>Contexto: mermas en quinta gama</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8, fontFamily: FONT }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: RS.textLight }}>Merma actual</span>
                <span style={{ fontWeight: 800, color: RS.red }}>{fmtPct(pctGlobal, 3)}</span>
              </div>
              <div style={{ background: RS.lavender, borderRadius: 4, height: 10 }}>
                <div style={{ width: `${Math.min(50, pctGlobal * 25)}%`, height: "100%", borderRadius: 4, background: RS.red }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: RS.textLight }}>Esperado quinta gama</span>
                <span style={{ fontWeight: 800, color: RS.green }}>0,5 % — 2 %</span>
              </div>
              <div style={{ background: RS.lavender, borderRadius: 4, height: 10 }}>
                <div style={{ width: "30%", height: "100%", borderRadius: 4, background: RS.green }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: RS.textLight }}>Cocina tradicional</span>
                <span style={{ fontWeight: 800, color: RS.primary }}>2 % — 5 %</span>
              </div>
              <div style={{ background: RS.lavender, borderRadius: 4, height: 10 }}>
                <div style={{ width: "60%", height: "100%", borderRadius: 4, background: RS.primary }} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: RS.text, marginTop: 8, lineHeight: 1.5 }}>
              El registro de mermas sigue siendo <strong>insuficiente</strong> (esperado 0,5 % — 2 %). <strong>Bilbao y Pamplona</strong> son los únicos con registro mensual completo en 2026 (Ene—Abr). <strong>Vitoria</strong> registra desde Feb 26 (sin datos de Ene). <strong>Donosti</strong> solo ha registrado Ene 26 y desde entonces no aparecen registros. <strong>Burgos</strong> solo registró Nov 25, no aparece en 2026. <strong>Zaragoza</strong> registró Nov—Dic 25 y solo Feb 26. La cobertura es desigual e insuficiente para sacar conclusiones operativas robustas.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================================
//  SECTION 6: DESVIACIONES DE ALMACÉN
// ============================================================
const Section6_Inventario = ({ months }) => {
  // Filter by months
  const desvFiltered = DESVIACIONES.filter(d => months.includes(d.monthKey));

  return (
    <div>
      <SectionTitle icon="📦" title="Desviaciones de almacén" subtitle="Diferencia entre consumo teórico y real de inventario — T-Spoon Lab · No hay archivo de Abril 26"
        tooltip="Consumo teórico (escandallos × ventas) menos consumo real de stock" />

      <Card>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, desvFiltered.length)}, 1fr)`, gap: 8, marginBottom: 16 }}>
          {desvFiltered.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", padding: 24, textAlign: "center", color: RS.textLight, fontFamily: FONT, fontSize: 13 }}>
              No hay datos de desviaciones de almacén para el periodo seleccionado. Los archivos disponibles cubren Ago 25 — Mar 26.
            </div>
          ) : desvFiltered.map(d => {
            const bg = d.value > 50000 ? "#FFEBEE"
                    : d.value < -10000 ? "#E8F5E9"
                    : d.value > 10000 ? "#FFF3E0"
                    : RS.lavender;
            const txt = d.value > 50000 ? "#7A0000"
                    : d.value < 0 ? "#1B5E20"
                    : d.value > 10000 ? "#E65100"
                    : RS.text;
            return (
              <div key={d.monthKey} style={{ background: bg, padding: 10, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: RS.textLight, fontFamily: FONT, fontWeight: 600 }}>{d.mes}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: txt, fontFamily: FONT }}>{fmtShort(d.value)}</div>
                <div style={{ fontSize: 9, color: RS.textLight, marginTop: 4, fontFamily: FONT, lineHeight: 1.3 }}>
                  {d.locales.length} locales
                </div>
              </div>
            );
          })}
        </div>

        {desvFiltered.length > 0 && (
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={desvFiltered.map(d => ({ mes: d.mes, value: d.value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={RS.lavenderMid} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: RS.text, fontFamily: FONT }} />
                <YAxis tick={{ fontSize: 11, fill: RS.text, fontFamily: FONT }} tickFormatter={fmtShort} />
                <Tooltip content={<RSTooltip />} />
                <ReferenceLine y={0} stroke={RS.purpleSoft} strokeDasharray="3 3" />
                <Bar dataKey="value">
                  {desvFiltered.map((d, i) => (
                    <Cell key={i} fill={d.value > 50000 ? RS.red : d.value < 0 ? RS.green : d.value > 10000 ? RS.orange : RS.primary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <Alert type="warning">
          <strong>Cobertura variable por mes:</strong> no todos los locales tienen desviaciones de almacén registradas cada mes. Agosto solo Bilbao y Burgos; Octubre y Noviembre no incluyen Bilbao ni Donosti; Diciembre no incluye Zaragoza; Ene—Mar 26 no incluye Zaragoza; Marzo 26 tampoco Burgos. <strong>Abril 26 no tiene archivo entregado.</strong> Los totales mensuales no son directamente comparables.
        </Alert>

        <Alert type="info">
          Las desviaciones presentan variaciones extremas (de -57.712 € hasta +136.969 €). Análisis detallado producto a producto realizado anteriormente revela que se deben mayoritariamente a <strong>errores de registro de inventario</strong>: cantidades en formato numérico incorrecto, confusiones de unidades de medida (g/kg) y escandallos mal configurados. Caso documentado: Panceta Arrotalota en Vitoria (Dic 25) genera ~117.355 € de desviación (86 % del total del mes) por error de cantidad inicial (5.672 Kg en vez de 5,672 Kg). <strong>No es fraude — es problema de captura.</strong>
        </Alert>
      </Card>
    </div>
  );
};

// ============================================================
//  SECTION 7: CORRELACIÓN
// ============================================================
const Section7_Correlacion = ({ months }) => {
  // Recalcula los totales por ciudad usando solo los meses del filtro
  const data = useMemo(() => CITIES.map(c => {
    let cajaNeto = 0;
    let factValue = 0;
    months.forEach(m => {
      const idx = ALL_MONTHS.indexOf(m);
      cajaNeto += CAJA_MONTHLY[c][idx] || 0;
      factValue += FACT_MONTHLY[c][idx]?.[1] || 0;
    });
    return {
      x: factValue,
      y: Math.abs(cajaNeto),
      cajaNeto,
      city: c, z: 100,
    };
  }), [months]);

  const periodoLabel = months.length === 16 ? "Periodo completo (Ene 25 — Abr 26)"
    : months.length === 12 ? "Año completo seleccionado"
    : months.length === 4 ? "YTD del año seleccionado"
    : `${months.length} mes(es) seleccionados`;

  return (
    <div>
      <SectionTitle icon="🔗" title="Análisis de correlación" subtitle={`¿Se relacionan las anulaciones con el dinero que falta? · ${periodoLabel}`} />

      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: RS.primary, margin: "0 0 12px 0", fontFamily: FONT }}>
          Facturas-Tickets eliminados (€) vs. Descuadre de caja (€) por local
        </h3>
        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke={RS.lavenderMid} />
              <XAxis type="number" dataKey="x" name="Facturas-Tickets eliminados" tick={{ fontSize: 11, fill: RS.text, fontFamily: FONT }} tickFormatter={fmtShort}
                label={{ value: "Facturas-Tickets eliminados (€)", position: "insideBottom", offset: -8, fontSize: 11, fontFamily: FONT, fill: RS.text }} />
              <YAxis type="number" dataKey="y" name="Descuadre caja" tick={{ fontSize: 11, fill: RS.text, fontFamily: FONT }} tickFormatter={fmtShort}
                label={{ value: "|Descuadre caja| (€)", angle: -90, position: "insideLeft", fontSize: 11, fontFamily: FONT, fill: RS.text }} />
              <ZAxis type="number" dataKey="z" range={[200, 500]} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={{ background: RS.white, border: `1px solid ${RS.purpleSoft}`, borderRadius: 8, padding: 10, fontSize: 12, fontFamily: FONT }}>
                    <div style={{ fontWeight: 800, color: RS.primary }}>{d.city}</div>
                    <div style={{ color: RS.text }}>Facturas-Tickets eliminados: {fmt(d.x)}</div>
                    <div style={{ color: RS.text }}>|Descuadre caja|: {fmt(d.y)}</div>
                  </div>
                );
              }} />
              <Scatter data={data}>
                {data.map((d, i) => <Cell key={i} fill={CITY_COLORS[d.city]} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8, justifyContent: "center", fontFamily: FONT }}>
          {Object.entries(CITY_COLORS).map(([city, color]) => (
            <div key={city} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: color, display: "inline-block" }} />
              <span style={{ color: RS.text }}>{city}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: RS.primary, margin: 0, fontFamily: FONT }}>Interpretación</h3>
          <Badge color={RS.purpleSoft}>Análisis del periodo completo · no se actualiza con el filtro</Badge>
        </div>
        <p style={{ fontSize: 13, color: RS.text, lineHeight: 1.6, fontFamily: FONT }}>
          A nivel global <strong>no existe una correlación fuerte y consistente</strong> entre el volumen de facturas-tickets / productos eliminados y los descuadres de caja. Sin embargo, hay patrones claramente diferenciados por local:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10, fontFamily: FONT }}>
          <div style={{ background: "#FFEBEE", padding: 12, borderRadius: 8, border: `1px solid ${RS.red}33` }}>
            <div style={{ fontWeight: 800, color: RS.red, fontSize: 13 }}>🔴 Donosti — Patrón resuelto</div>
            <p style={{ fontSize: 12, color: "#7A0000", marginTop: 4, lineHeight: 1.5 }}>
              Descuadre acumulado de -25.595 € con relativamente pocas anulaciones (24 facturas-tickets). El problema se concentró Feb—Ago 2025 y desde entonces el descuadre se ha revertido a positivo (+2.614 € desde Sep 25). Sugiere que algo cambió.
            </p>
          </div>
          <div style={{ background: "#FFF3E0", padding: 12, borderRadius: 8, border: `1px solid ${RS.orange}33` }}>
            <div style={{ fontWeight: 800, color: RS.orange, fontSize: 13 }}>🟠 Pamplona — Patrón persistente</div>
            <p style={{ fontSize: 12, color: "#E65100", marginTop: 4, lineHeight: 1.5 }}>
              337 facturas-tickets eliminados (20.896 €) + descuadre de caja -12.501 €. ARIANNE acumula 198 (13.396 €). El volumen sigue activo y vinculado al faltante de caja.
            </p>
          </div>
          <div style={{ background: "#FFF8E1", padding: 12, borderRadius: 8, border: `1px solid ${RS.gold}66` }}>
            <div style={{ fontWeight: 800, color: "#7A4F00", fontSize: 13 }}>🟡 Vitoria — Pico Ene 26</div>
            <p style={{ fontSize: 12, color: "#7A4F00", marginTop: 4, lineHeight: 1.5 }}>
              Descuadre acumulado -6.167 € con un pico anómalo en Ene 26 (-2.057 €). Marzo 26 también negativo (-357 €). Requiere seguimiento.
            </p>
          </div>
          <div style={{ background: "#E8F5E9", padding: 12, borderRadius: 8, border: `1px solid ${RS.green}33` }}>
            <div style={{ fontWeight: 800, color: RS.green, fontSize: 13 }}>🟢 Bilbao — Bajo riesgo</div>
            <p style={{ fontSize: 12, color: "#1B5E20", marginTop: 4, lineHeight: 1.5 }}>
              Descuadre contenido (-1.154 €), pocas anulaciones. Los descuadres son compatibles con errores operativos normales. Cierres de Abril prácticamente perfectos.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ============================================================
//  SECTION 8: CONCLUSIONES
// ============================================================
const Section8_Conclusiones = () => (
  <div>
    <SectionTitle icon="📋" title="Diagnóstico y conclusiones" subtitle="Periodo completo Ene 25 — Abr 26" />

    <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
      <Badge color={RS.purpleSoft}>Análisis del periodo completo · no se actualiza con el filtro</Badge>
    </div>

    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: FONT }}>
        <div style={{ background: RS.lavender, padding: 14, borderRadius: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: RS.primary, margin: "0 0 6px 0" }}>1. Desviaciones de almacén — Problema de registros, no fraude</h3>
          <p style={{ fontSize: 13, color: RS.text, margin: 0, lineHeight: 1.5 }}>
            Las desviaciones oscilan entre -57.712 € (Nov 25) y +136.969 € (Dic 25) y se deben mayoritariamente a errores de introducción de datos en T-Spoon Lab (unidades de medida incorrectas, cantidades con formato erróneo, escandallos mal configurados). Tras la nueva extracción por local—mes la cobertura mejora pero sigue siendo desigual (no todos los locales tienen archivo cada mes). <strong>No hay archivo de Abril 26.</strong>
          </p>
        </div>

        <div style={{ background: RS.lavender, padding: 14, borderRadius: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: RS.primary, margin: "0 0 6px 0" }}>2. Mermas — Mejora parcial, aún insuficiente</h3>
          <p style={{ fontSize: 13, color: RS.text, margin: 0, lineHeight: 1.5 }}>
            Mermas totales registradas: <strong>2.687,29 €</strong> (Ene 25 — Abr 26) frente a 2.628.406 € de ventas (taxable base) — <strong>0,102 % sobre ventas</strong>, muy por debajo del 0,5 % — 2 % esperado en quinta gama. Bilbao y Pamplona son los únicos con registro mensual completo en 2026; Vitoria registra desde Feb 26 sin enero. <strong>Donosti, Burgos y Zaragoza tienen cobertura mínima</strong> (probable problema de captura, no operativo). La cobertura mejorada con la nueva extracción por archivo individual revela que el problema de registro es estructural, no puntual.
          </p>
        </div>

        <div style={{ background: "#FFEBEE", padding: 14, borderRadius: 8, border: `1px solid ${RS.red}33` }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: RS.red, margin: "0 0 6px 0" }}>3. Descuadres de caja — Atención focalizada</h3>
          <p style={{ fontSize: 13, color: "#7A0000", margin: 0, lineHeight: 1.5 }}>
            Faltante neto total acumulado: <strong>-52.872 €</strong>. Donosti aporta el 48 % (-25.595 €), pero su problema ya se contuvo en Sep 25 y desde entonces presenta saldos positivos. Pamplona (-12.501 €) sigue activo con tendencia estable. <strong>Vitoria muestra un pico preocupante en Ene 26 (-2.057 €)</strong>. Abril 26 es un mes prácticamente neutro o positivo en todos los locales salvo Pamplona y Zaragoza, con cifras pequeñas.
          </p>
        </div>

        <div style={{ background: "#FFF3E0", padding: 14, borderRadius: 8, border: `1px solid ${RS.orange}33` }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: RS.orange, margin: "0 0 6px 0" }}>4. Anulaciones — Anomalía persistente en Pamplona</h3>
          <p style={{ fontSize: 13, color: "#E65100", margin: 0, lineHeight: 1.5 }}>
            Pamplona concentra el <strong>75 %</strong> de las facturas-tickets eliminados (337 de 449). ARIANNE acumula 198 (13.396 €) y UNAX 85 (5.296 €). En productos eliminados después de facturar, ARIANNE acumula 321 productos por valor de 4.420 € (excluido el registro no real de 100.000 € — ver punto 5). El patrón no solo persiste sino que se intensifica.
          </p>
        </div>

        <div style={{ background: RS.lavender, padding: 14, borderRadius: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: RS.primary, margin: "0 0 6px 0" }}>5. Registro NO REAL detectado en Pamplona — debe excluirse</h3>
          <p style={{ fontSize: 13, color: RS.text, margin: 0, lineHeight: 1.5 }}>
            En productos eliminados después de facturar de Pamplona aparece <strong>1 registro de 100.000,00 €</strong> el 29/08/2025 por ARIANNE ("Atención por 2 bellezones"). Por su naturaleza (concepto, importe redondo y descripción) <strong>no se trata de una operación real de venta sino de una broma del equipo, una prueba interna o un ejemplo introducido a propósito</strong> en el sistema. No tiene valor analítico y se ha excluido del cálculo. Acción recomendada: pedir al equipo de Pamplona que lo elimine del Last.app para que no siga distorsionando los reportes futuros.
          </p>
        </div>
      </div>
    </Card>

    <SectionTitle icon="🎯" title="Recomendaciones" />

    <Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontFamily: FONT }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: RS.primary, borderBottom: `2px solid ${RS.gold}`, paddingBottom: 6 }}>Acciones inmediatas</h3>
          <div style={{ fontSize: 13, color: RS.text, lineHeight: 1.6, marginTop: 8 }}>
            <p style={{ margin: "6px 0" }}>· <strong>Pamplona:</strong> Auditar las 337 facturas-tickets eliminados. Restringir permisos de anulación de ARIANNE y UNAX a aprobación de encargado. Exigir motivo documentado.</p>
            <p style={{ margin: "6px 0" }}>· <strong>Pamplona — Registro no real de 100k:</strong> Pedir al equipo del local que lo elimine en Last.app (es una broma/prueba interna), para que no siga distorsionando los reportes futuros.</p>
            <p style={{ margin: "6px 0" }}>· <strong>Donosti:</strong> Documentar qué cambió en Sep 25 que detuvo el descuadre. Replicar el control en otros locales.</p>
            <p style={{ margin: "6px 0" }}>· <strong>Vitoria:</strong> Investigar el pico de Ene 26 (-2.057 €). Verificar cambio de personal o procedimiento.</p>
            <p style={{ margin: "6px 0" }}>· <strong>Todos:</strong> Implementar arqueos de caja con doble verificación al cierre.</p>
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: RS.primary, borderBottom: `2px solid ${RS.gold}`, paddingBottom: 6 }}>Acciones estructurales</h3>
          <div style={{ fontSize: 13, color: RS.text, lineHeight: 1.6, marginTop: 8 }}>
            <p style={{ margin: "6px 0" }}>· Corregir escandallos y protocolo de inventarios en T-Spoon Lab (doble verificación, control de coherencia mensual).</p>
            <p style={{ margin: "6px 0" }}>· <strong>Burgos y Zaragoza:</strong> arrancar registro de mermas en T-Spoon — la cifra de 0 € no es realista.</p>
            <p style={{ margin: "6px 0" }}>· Limitar permisos de eliminación de facturas-tickets y productos a encargados, con motivo documentado obligatorio.</p>
            <p style={{ margin: "6px 0" }}>· Monitorizar mensualmente: ratio anulaciones por empleado, descuadre por turno, mermas registradas vs. objetivo 0,5 %.</p>
            <p style={{ margin: "6px 0" }}>· <strong>Auditoría:</strong> entregar al CFO el Excel auditable con todos los cálculos y trazabilidad al dato origen para validación independiente.</p>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

// ============================================================
//  MAIN APP
// ============================================================
export default function Report() {
  const [section, setSection] = useState(0);
  const [period, setPeriod] = useState("all");
  const months = useMemo(() => monthsInPeriod(period), [period]);

  const sections = [
    { label: "Resumen",          component: <Section1_Resumen months={months} /> },
    { label: "Caja",             component: <Section2_Caja months={months} period={period} /> },
    { label: "Facturas-Tickets", component: <Section3_Facturas months={months} /> },
    { label: "Productos",        component: <Section4_Productos months={months} /> },
    { label: "Mermas",           component: <Section5_Mermas months={months} /> },
    { label: "Inventario",       component: <Section6_Inventario months={months} /> },
    { label: "Correlación",      component: <Section7_Correlacion months={months} /> },
    { label: "Conclusiones",     component: <Section8_Conclusiones /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: RS.lavender, fontFamily: FONT, color: RS.text }}>
      <Header period={period} setPeriod={setPeriod} section={section} setSection={setSection} sections={sections} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px" }}>
        {sections[section].component}
      </div>

      <div style={{ background: RS.primaryDark, color: RS.purpleSoft, padding: "16px 24px", textAlign: "center", fontSize: 11, marginTop: 24, borderTop: `2px solid ${RS.gold}`, fontFamily: FONT }}>
        <span style={{ color: RS.gold, fontWeight: 700, letterSpacing: 1 }}>ROCKSTAR DATA</span>
        {" · "}
        Informe generado a partir de Last.app + T-Spoon Lab · PallaPizza S.L. — Isla Sicilia · Periodo: Enero 2025 — Abril 2026 · Datos hasta 26/04/2026 · Confidencial
      </div>
    </div>
  );
}
