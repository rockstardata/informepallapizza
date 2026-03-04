import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line, ComposedChart, Area, ReferenceLine, ScatterChart, Scatter, ZAxis } from "recharts";

const COLORS = {
  red: "#DC2626",
  redLight: "#FCA5A5",
  orange: "#F97316",
  orangeLight: "#FDBA74",
  green: "#16A34A",
  greenLight: "#86EFAC",
  blue: "#2563EB",
  blueLight: "#93C5FD",
  purple: "#7C3AED",
  gray: "#6B7280",
  grayLight: "#E5E7EB",
  bg: "#FAFAF9",
  card: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
};

const CITY_COLORS = {
  Bilbao: "#2563EB",
  Burgos: "#7C3AED",
  Donosti: "#DC2626",
  Pamplona: "#F97316",
  Vitoria: "#16A34A",
  Zaragoza: "#0891B2",
};

const fmt = (n) => {
  if (n === undefined || n === null) return "—";
  return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
};

const fmtShort = (n) => {
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + "k€";
  return n.toFixed(0) + "€";
};

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

// ====== DATA ======
const descuadreCaja = [
  { city: "Bilbao", neto: -1149.06, falta: -1884.69, sobra: 735.63, dias: 21, registros: 348 },
  { city: "Burgos", neto: -3070.74, falta: -4717.68, sobra: 1646.94, dias: 49, registros: 331 },
  { city: "Donosti", neto: -27757.91, falta: -38428.68, sobra: 10670.77, dias: 129, registros: 323 },
  { city: "Pamplona", neto: -10674.56, falta: -12032.09, sobra: 1357.53, dias: 70, registros: 369 },
  { city: "Vitoria", neto: -3758.48, falta: -6435.26, sobra: 2676.78, dias: 43, registros: 338 },
  { city: "Zaragoza", neto: -3242.48, falta: -6964.50, sobra: 3722.02, dias: 61, registros: 389 },
];

const facturasEliminadas = [
  { city: "Bilbao", count: 13, value: 698.26 },
  { city: "Burgos", count: 3, value: 199.75 },
  { city: "Donosti", count: 13, value: 643.99 },
  { city: "Pamplona", count: 261, value: 16427.84 },
  { city: "Vitoria", count: 9, value: 542.90 },
  { city: "Zaragoza", count: 29, value: 1622.79 },
];

const productosEliminados = [
  { city: "Bilbao", total: 447, cocina: 602, facturar: 228, value: 5232.05, vCocina: 6557.30, vFacturar: 2183.90 },
  { city: "Burgos", total: 144, cocina: 321, facturar: 48, value: 2002.25, vCocina: 3322.95, vFacturar: 400.50 },
  { city: "Donosti", total: 520, cocina: 810, facturar: 270, value: 7379.80, vCocina: 9654.15, vFacturar: 2763.80 },
  { city: "Pamplona", total: 727, cocina: 1180, facturar: 539, value: 13332.95, vCocina: 13124.15, vFacturar: 7222.15 },
  { city: "Vitoria", total: 254, cocina: 256, facturar: 74, value: 3743.00, vCocina: 2931.25, vFacturar: 757.25 },
  { city: "Zaragoza", total: 835, cocina: 1250, facturar: 489, value: 7832.35, vCocina: 16219.65, vFacturar: 4003.95 },
];

const mermas = [
  { city: "Bilbao", value: 664.07, items: 59, conCoste: 52, sinCoste: 7 },
  { city: "Burgos", value: 11.69, items: 5, conCoste: 5, sinCoste: 0 },
  { city: "Donosti", value: 29.30, items: 10, conCoste: 10, sinCoste: 0 },
  { city: "Pamplona", value: 437.36, items: 28, conCoste: 24, sinCoste: 4 },
  { city: "Vitoria", value: 279.91, items: 39, conCoste: 24, sinCoste: 15 },
  { city: "Zaragoza", value: 232.63, items: 45, conCoste: 41, sinCoste: 4 },
];

const ventasPorLocal = [
  { city: "Bilbao", ventas: 294311.28 },
  { city: "Burgos", ventas: 235069.94 },
  { city: "Donosti", ventas: 408109.42 },
  { city: "Pamplona", ventas: 525075.74 },
  { city: "Vitoria", ventas: 275400.57 },
  { city: "Zaragoza", ventas: 401257.72 },
];

const desviaciones = [
  { mes: "Ago", value: 6674.28, locales: "Bilbao, Burgos" },
  { mes: "Sep", value: -1997.82, locales: "Burgos, Donosti, Pamplona, Vitoria, Zaragoza" },
  { mes: "Oct", value: 19552.71, locales: "Burgos, Pamplona, Vitoria, Zaragoza" },
  { mes: "Nov", value: -74266.76, locales: "Burgos, Pamplona, Vitoria, Zaragoza" },
  { mes: "Dic", value: 126110.84, locales: "Bilbao, Burgos, Donosti, Pamplona, Vitoria" },
];

const topEmpleadosFacturas = [
  { name: "ARIANNE", city: "Pamplona", count: 165, value: 11651.03 },
  { name: "UNAX", city: "Pamplona", count: 42, value: 2572.75 },
  { name: "IÑAKI", city: "Pamplona", count: 29, value: 1203.44 },
  { name: "LEA", city: "Pamplona", count: 25, value: 1000.62 },
  { name: "JUDITH", city: "Zaragoza", count: 13, value: 847.60 },
  { name: "SERGIO", city: "Zaragoza", count: 11, value: 604.45 },
  { name: "GABRIEL", city: "Vitoria", count: 8, value: 540.45 },
  { name: "SANTI", city: "Donosti", count: 8, value: 345.79 },
];

const cajaMensual = {
  Donosti: [{m:2,v:-3428.94},{m:3,v:-3397.38},{m:4,v:-7678.87},{m:5,v:-2578.23},{m:6,v:-1741.42},{m:7,v:-5234.10},{m:8,v:-4150.83},{m:9,v:-189.73},{m:10,v:313.79},{m:11,v:260.90},{m:12,v:66.90}],
  Pamplona: [{m:1,v:-1699.93},{m:2,v:-1741.71},{m:3,v:-0.16},{m:4,v:-320.75},{m:5,v:-3059.26},{m:6,v:-336.39},{m:7,v:179.38},{m:8,v:118.98},{m:9,v:-605.27},{m:10,v:-916.50},{m:11,v:-596.94},{m:12,v:-1696.01}],
  Vitoria: [{m:1,v:0},{m:2,v:0.06},{m:3,v:-58.77},{m:4,v:222.51},{m:5,v:-745.10},{m:6,v:-1275.00},{m:7,v:-123.99},{m:8,v:-1137.39},{m:9,v:972.08},{m:10,v:-1386.95},{m:11,v:32.51},{m:12,v:-258.44}],
  Bilbao: [{m:1,v:-160.54},{m:2,v:30.52},{m:3,v:0},{m:4,v:1.90},{m:5,v:-89.94},{m:6,v:-1082.85},{m:7,v:281.13},{m:8,v:-28.69},{m:9,v:3.75},{m:10,v:-104.37},{m:11,v:0.03},{m:12,v:0}],
  Burgos: [{m:1,v:-691.52},{m:2,v:73},{m:3,v:-386.23},{m:4,v:69.61},{m:5,v:-239.87},{m:6,v:58.71},{m:7,v:-399.96},{m:8,v:19.81},{m:9,v:-10.31},{m:10,v:119.06},{m:11,v:174.10},{m:12,v:-1857.14}],
  Zaragoza: [{m:1,v:-53.11},{m:2,v:-214.65},{m:3,v:69.11},{m:4,v:-442.10},{m:5,v:-190.44},{m:6,v:-1982.98},{m:7,v:-67.20},{m:8,v:-922.18},{m:9,v:-152.30},{m:10,v:2071.26},{m:11,v:-1034.19},{m:12,v:-323.70}],
};

const cajaMensualAll = [];
Object.entries(cajaMensual).forEach(([city, data]) => {
  data.forEach(d => cajaMensualAll.push({ city, month: MONTHS[d.m - 1], monthNum: d.m, value: d.v }));
});

// ====== COMPONENTS ======
const Badge = ({ children, color = "red" }) => {
  const colors = {
    red: "bg-red-100 text-red-800",
    orange: "bg-orange-100 text-orange-800",
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${colors[color]}`}>{children}</span>;
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${className}`}>{children}</div>
);

const KPI = ({ label, value, sub, color = "text-gray-900", alert }) => (
  <div className="text-center">
    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    {alert && <div className="mt-1">{alert}</div>}
  </div>
);

const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="mb-6 mt-10 first:mt-0">
    <div className="flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
    {subtitle && <p className="text-sm text-gray-500 mt-1 ml-9">{subtitle}</p>}
  </div>
);

const AlertBox = ({ type = "warning", children }) => {
  const styles = {
    warning: "bg-amber-50 border-amber-300 text-amber-900",
    danger: "bg-red-50 border-red-300 text-red-900",
    info: "bg-blue-50 border-blue-300 text-blue-900",
    success: "bg-green-50 border-green-300 text-green-800",
  };
  const icons = { warning: "⚠️", danger: "🚨", info: "ℹ️", success: "✅" };
  return (
    <div className={`border-l-4 rounded-r-lg p-4 my-4 text-sm ${styles[type]}`}>
      <span className="mr-2">{icons[type]}</span>{children}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }}></span>
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-semibold">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ====== SECTIONS ======
const Section1_Resumen = () => {
  const totalDescuadre = descuadreCaja.reduce((s, d) => s + d.neto, 0);
  const totalFactElim = facturasEliminadas.reduce((s, d) => s + d.value, 0);
  const totalProdElim = productosEliminados.reduce((s, d) => s + d.value, 0);
  const totalMermas = mermas.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">INFORME DE ANÁLISIS DE FRAUDE</h1>
        <p className="text-lg text-gray-500 mt-1">PallaPizza — Isla Sicilia</p>
        <p className="text-sm text-gray-400 mt-1">Periodo: Enero — Diciembre 2025 · Fuentes: T-Spoon Lab + Last.app</p>
      </div>

      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <KPI label="Descuadre de caja neto" value={fmt(totalDescuadre)} color="text-red-600" sub="6 locales · 2025" />
          <KPI label="Facturas eliminadas" value={fmt(totalFactElim)} color="text-orange-600" sub={`${facturasEliminadas.reduce((s,d)=>s+d.count,0)} facturas`} />
          <KPI label="Productos eliminados" value={fmt(totalProdElim)} color="text-amber-600" sub={`${productosEliminados.reduce((s,d)=>s+d.total,0)} productos`} />
          <KPI label="Mermas registradas" value={fmt(totalMermas)} color="text-green-700" sub="Año completo"
            alert={<Badge color="orange">0,077% sobre ventas — Muy bajo</Badge>} />
        </div>
      </Card>

      <AlertBox type="info">
        Este informe analiza tres vectores de posible fraude: descuadres de caja, anulaciones de facturas/productos, y desviaciones de inventario. El objetivo es identificar si existe correlación entre las anulaciones, las ausencias de mercancía y el efectivo no ingresado.
      </AlertBox>
    </div>
  );
};

const Section2_Caja = () => {
  const chartData = descuadreCaja.map(d => ({
    city: d.city,
    falta: Math.abs(d.falta),
    sobra: d.sobra,
    neto: d.neto,
  }));

  const [selectedCity, setSelectedCity] = useState("Donosti");
  const lineData = (cajaMensual[selectedCity] || []).map(d => ({
    month: MONTHS[d.m - 1],
    value: d.v,
  }));

  return (
    <div>
      <SectionTitle icon="💰" title="Descuadres de caja" subtitle="Diferencia entre efectivo esperado (TPV) y efectivo real contado — 2025" />

      <Card>
        <div className="grid grid-cols-6 gap-3 mb-6">
          {descuadreCaja.map(d => (
            <div key={d.city} className="text-center p-3 rounded-lg bg-gray-50">
              <div className="text-xs font-semibold text-gray-500">{d.city}</div>
              <div className={`text-lg font-bold ${d.neto < -5000 ? "text-red-600" : d.neto < -1000 ? "text-orange-500" : "text-gray-700"}`}>
                {fmtShort(d.neto)}
              </div>
              <div className="text-xs text-gray-400">{d.dias} días con faltante</div>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={chartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="city" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={fmtShort} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="falta" name="Falta en caja" fill={COLORS.red} radius={[4,4,0,0]} />
              <Bar dataKey="sobra" name="Sobra en caja" fill={COLORS.green} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <AlertBox type="danger">
        <strong>Donosti</strong> presenta un descuadre neto de <strong>-27.757,91 €</strong>, con 129 de 323 días con faltante de efectivo. Esto es significativamente superior al resto de locales y requiere investigación inmediata.
      </AlertBox>

      <Card className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-gray-700">Evolución mensual del descuadre</h3>
          <div className="flex gap-1">
            {Object.keys(cajaMensual).map(c => (
              <button key={c} onClick={() => setSelectedCity(c)}
                className={`px-2 py-1 text-xs rounded-md font-medium transition ${selectedCity === c ? "text-white shadow" : "text-gray-500 bg-gray-100 hover:bg-gray-200"}`}
                style={selectedCity === c ? { background: CITY_COLORS[c] } : {}}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer>
            <ComposedChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={fmtShort} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
              <Bar dataKey="value" name="Descuadre">
                {lineData.map((e, i) => (
                  <Cell key={i} fill={e.value < 0 ? COLORS.red : COLORS.green} opacity={0.7} radius={[3,3,0,0]} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

const Section3_Facturas = () => {
  const chartData = facturasEliminadas.map(d => ({ ...d, label: `${d.city}` }));

  return (
    <div>
      <SectionTitle icon="🧾" title="Facturas eliminadas" subtitle="Facturas borradas del sistema tras ser generadas — 2025" />

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Por local (cantidad y valor)</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={fmtShort} />
                <YAxis type="category" dataKey="city" tick={{ fontSize: 11 }} width={75} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Importe" radius={[0,4,4,0]}>
                  {chartData.map((e, i) => (
                    <Cell key={i} fill={e.value > 5000 ? COLORS.red : e.value > 1000 ? COLORS.orange : COLORS.blue} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Top empleados — facturas eliminadas</h3>
          <div className="space-y-2">
            {topEmpleadosFacturas.map((e, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 text-xs text-gray-400 text-right">{i + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-800">{e.name}</span>
                    <span className="text-xs text-gray-400">{e.city}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                    <div className="h-2 rounded-full" style={{
                      width: `${Math.min(100, (e.value / topEmpleadosFacturas[0].value) * 100)}%`,
                      background: e.value > 5000 ? COLORS.red : e.value > 1000 ? COLORS.orange : COLORS.blue
                    }}></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-800">{fmt(e.value)}</div>
                  <div className="text-xs text-gray-400">{e.count} fact.</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <AlertBox type="danger">
        <strong>Pamplona concentra el 79,5% de todas las facturas eliminadas</strong> (261 de 328) por un valor de 16.427,84 €. La empleada ARIANNE acumula 165 facturas eliminadas (11.651,03 €). Esta concentración en un solo local y una sola persona es anómala y requiere investigación.
      </AlertBox>
    </div>
  );
};

const Section4_Productos = () => {
  const chartData = productosEliminados.map(d => ({
    city: d.city,
    "Antes de cocina": d.value,
    "Después de cocina": d.vCocina,
    "Después de facturar": d.vFacturar,
  }));

  return (
    <div>
      <SectionTitle icon="🍕" title="Productos eliminados" subtitle="Productos borrados de comandas en distintas fases del servicio — 2025" />

      <Card>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 font-semibold">Eliminados (total)</div>
            <div className="text-xl font-bold text-blue-800">{productosEliminados.reduce((s,d)=>s+d.total,0).toLocaleString()}</div>
            <div className="text-xs text-blue-500">{fmt(productosEliminados.reduce((s,d)=>s+d.value,0))}</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-xs text-orange-600 font-semibold">Después de cocina</div>
            <div className="text-xl font-bold text-orange-800">{productosEliminados.reduce((s,d)=>s+d.cocina,0).toLocaleString()}</div>
            <div className="text-xs text-orange-500">{fmt(productosEliminados.reduce((s,d)=>s+d.vCocina,0))}</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-xs text-red-600 font-semibold">Después de facturar</div>
            <div className="text-xl font-bold text-red-800">{productosEliminados.reduce((s,d)=>s+d.facturar,0).toLocaleString()}</div>
            <div className="text-xs text-red-500">{fmt(productosEliminados.reduce((s,d)=>s+d.vFacturar,0))}</div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="city" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={fmtShort} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Antes de cocina" fill={COLORS.blue} radius={[4,4,0,0]} />
              <Bar dataKey="Después de cocina" fill={COLORS.orange} radius={[4,4,0,0]} />
              <Bar dataKey="Después de facturar" fill={COLORS.red} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <AlertBox type="warning">
        Los <strong>productos eliminados después de facturar</strong> son los más críticos: el producto ya se preparó, se sirvió y se facturó, pero luego se eliminó del sistema. Esto puede indicar que se cobró al cliente (en efectivo) y después se borró la venta para quedarse con el dinero. Pamplona y Zaragoza lideran este indicador.
      </AlertBox>
    </div>
  );
};

const Section5_Mermas = () => {
  const totalVentas = ventasPorLocal.reduce((s,d) => s + d.ventas, 0);
  const totalMermas = mermas.reduce((s,d) => s + d.value, 0);
  const pctGlobal = ((totalMermas / totalVentas) * 100).toFixed(3);

  const mermaConVentas = mermas.map(m => {
    const v = ventasPorLocal.find(v => v.city === m.city);
    const pct = v ? ((m.value / v.ventas) * 100) : 0;
    return { ...m, ventas: v ? v.ventas : 0, pct };
  });

  return (
    <div>
      <SectionTitle icon="🗑️" title="Mermas registradas" subtitle="Producto desechado/caducado registrado en T-Spoon Lab — Año 2025" />

      <Card className="mb-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-green-600 font-semibold">Mermas totales registradas</div>
            <div className="text-xl font-bold text-green-800">{fmt(totalMermas)}</div>
            <div className="text-xs text-green-500">{mermas.reduce((s,d)=>s+d.items,0)} incidencias ({mermas.reduce((s,d)=>s+d.conCoste,0)} con coste)</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 font-semibold">Ventas totales (Taxable Base)</div>
            <div className="text-xl font-bold text-blue-800">{fmt(totalVentas)}</div>
            <div className="text-xs text-blue-500">6 locales · Last.app 2025</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-xs text-red-600 font-semibold">% Merma sobre ventas</div>
            <div className="text-xl font-bold text-red-800">{pctGlobal}%</div>
            <div className="text-xs text-red-500">Esperado quinta gama: 0,5% – 2%</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Mermas y % sobre ventas por local</h3>
          <div className="space-y-2">
            {mermaConVentas.map((m, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-20 font-semibold text-gray-700">{m.city}</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full bg-green-500" style={{ width: `${Math.min(100, (m.value / 700) * 100)}%` }}></div>
                  </div>
                </div>
                <div className="w-20 text-right text-gray-800 font-semibold">{fmt(m.value)}</div>
                <div className="w-16 text-right text-gray-500">{m.pct.toFixed(3)}%</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-400">
            Nota: {mermas.reduce((s,d)=>s+d.sinCoste,0)} incidencias registradas sin coste asociado (productos sin precio en T-Spoon Lab). El importe en euros solo incluye items con coste valorizado.
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Contexto: mermas en quinta gama</h3>
          <div className="space-y-4 mt-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Merma registrada actual</span>
                <span className="font-bold text-red-600">{pctGlobal}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="h-3 rounded-full bg-red-400" style={{ width: "2%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Rango esperado quinta gama</span>
                <span className="font-bold text-green-600">0,5% — 2%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="h-3 rounded-full bg-green-400" style={{ width: "25%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Rango cocina tradicional</span>
                <span className="font-bold text-blue-600">2% — 5%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="h-3 rounded-full bg-blue-400" style={{ width: "60%" }}></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Con un <strong>0,077%</strong> de mermas registradas (1.654,96 €) sobre 2.139.224,67 € de ventas anuales, el registro es claramente insuficiente. Incluso en quinta gama (producto ya elaborado), las mermas por caducidad, envases dañados y errores de regeneración deberían situarse entre el 0,5% y el 2%. El infrarregistro infla artificialmente las desviaciones de escandallo.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Section6_Desviaciones = () => (
  <div>
    <SectionTitle icon="📦" title="Desviaciones de escandallo" subtitle="Diferencia entre consumo teórico y real de inventario — T-Spoon Lab" />

    <Card>
      <div className="grid grid-cols-5 gap-3 mb-4">
        {desviaciones.map(d => (
          <div key={d.mes} className={`text-center p-3 rounded-lg ${d.value > 50000 ? "bg-red-50" : d.value < -10000 ? "bg-green-50" : d.value > 10000 ? "bg-orange-50" : "bg-gray-50"}`}>
            <div className="text-xs text-gray-500">{d.mes} 2025</div>
            <div className={`text-lg font-bold ${d.value > 50000 ? "text-red-600" : d.value < 0 ? "text-green-600" : d.value > 10000 ? "text-orange-600" : "text-gray-700"}`}>
              {fmt(d.value)}
            </div>
            <div className="text-xs text-gray-400 mt-1">{d.locales}</div>
          </div>
        ))}
      </div>

      <AlertBox type="warning">
        <strong>Cobertura variable por mes:</strong> no todos los locales tienen desviaciones de escandallo registradas cada mes. Agosto solo incluye Bilbao y Burgos; octubre y noviembre no incluyen Bilbao ni Donosti; diciembre no incluye Zaragoza. Los totales mensuales no son directamente comparables entre sí.
      </AlertBox>

      <AlertBox type="info">
        Las desviaciones presentan variaciones extremas (desde -74.266 € hasta +126.110 €). Noviembre y septiembre muestran desviaciones negativas grandes, lo que indica que el consumo teórico supera al real — posiblemente por ajustes de inventario o correcciones de errores previos. El análisis producto a producto ha revelado que las desviaciones se deben mayoritariamente a <strong>errores de registro de inventario</strong>: cantidades introducidas con formato numérico incorrecto, confusiones de unidades de medida (g/kg) y escandallos mal configurados. Un solo producto con un error puede generar desviaciones de decenas de miles de euros. Ejemplo: Panceta Arrotalota en Vitoria (diciembre) genera 110.537 € de desviación (87,7% del total del mes) por un error de cantidad inicial (5.672 Kg registrados en vez de 5,672 Kg).
      </AlertBox>
    </Card>
  </div>
);

const Section7_Correlacion = () => {
  const correlaciones = [
    { city: "Bilbao", factElim: -1149.06, factValue: 698.26, label: "Sin correlación clara" },
    { city: "Burgos", factElim: -3070.74, factValue: 199.75, label: "Descuadre alto, pocas anulaciones" },
    { city: "Donosti", factElim: -27757.91, factValue: 643.99, label: "Descuadre muy alto, pocas anulaciones" },
    { city: "Pamplona", factElim: -10674.56, factValue: 16427.84, label: "Ambos indicadores altos" },
    { city: "Vitoria", factElim: -3758.48, factValue: 542.90, label: "Moderado" },
    { city: "Zaragoza", factElim: -3242.48, factValue: 1622.79, label: "Moderado" },
  ];

  const scatterData = correlaciones.map(d => ({
    x: d.factValue,
    y: Math.abs(d.factElim),
    city: d.city,
    z: 100,
  }));

  return (
    <div>
      <SectionTitle icon="🔗" title="Análisis de correlación" subtitle="¿Se relacionan las anulaciones con el dinero que falta?" />

      <Card>
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Facturas eliminadas (€) vs. Descuadre de caja (€) por local</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" dataKey="x" name="Facturas eliminadas" tick={{ fontSize: 11 }} tickFormatter={fmtShort} label={{ value: "Facturas eliminadas (€)", position: "insideBottom", offset: -5, fontSize: 11 }} />
              <YAxis type="number" dataKey="y" name="Descuadre caja" tick={{ fontSize: 11 }} tickFormatter={fmtShort} label={{ value: "Descuadre caja (€)", angle: -90, position: "insideLeft", fontSize: 11 }} />
              <ZAxis type="number" dataKey="z" range={[100, 400]} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white border rounded-lg shadow-lg p-3 text-xs">
                    <div className="font-bold">{d.city}</div>
                    <div>Facturas eliminadas: {fmt(d.x)}</div>
                    <div>Descuadre caja: {fmt(d.y)}</div>
                  </div>
                );
              }} />
              <Scatter data={scatterData}>
                {scatterData.map((e, i) => (
                  <Cell key={i} fill={CITY_COLORS[e.city]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {Object.entries(CITY_COLORS).map(([city, color]) => (
            <div key={city} className="flex items-center gap-1 text-xs">
              <span className="w-3 h-3 rounded-full" style={{ background: color }}></span>
              {city}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-4">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Interpretación de la correlación</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>El análisis estadístico mensual muestra que <strong>no existe una correlación fuerte y consistente</strong> entre el volumen de facturas/productos eliminados y los descuadres de caja a nivel global. Sin embargo, hay patrones diferenciados por local:</p>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="font-bold text-red-800 text-sm">🔴 Donosti — Patrón sospechoso</div>
              <p className="text-xs text-red-700 mt-1">Descuadre de caja de -27.757 € con relativamente pocas anulaciones (13 facturas). Esto sugiere que el problema no es por anulaciones sino por <strong>ventas no registradas</strong> o errores sistemáticos en el manejo de efectivo.</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="font-bold text-orange-800 text-sm">🟠 Pamplona — Patrón de anulaciones</div>
              <p className="text-xs text-orange-700 mt-1">261 facturas eliminadas (16.427 €) + descuadre de caja de -10.674 €. Aquí sí existe un volumen de anulaciones anómalo concentrado en pocos empleados que podría estar vinculado al faltante de caja.</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="font-bold text-yellow-800 text-sm">🟡 Burgos — Descuadre con pocas anulaciones</div>
              <p className="text-xs text-yellow-700 mt-1">Solo 3 facturas eliminadas pero -3.070 € de descuadre. Patrón similar a Donosti a menor escala: el problema está en el manejo de efectivo, no en las anulaciones.</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="font-bold text-green-800 text-sm">🟢 Bilbao — Bajo riesgo</div>
              <p className="text-xs text-green-700 mt-1">Descuadre contenido (-1.149 €), pocas anulaciones. Los descuadres observados son compatibles con errores operativos normales en el manejo de efectivo.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const Section8_Conclusiones = () => (
  <div>
    <SectionTitle icon="📋" title="Diagnóstico y conclusiones" />

    <Card>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">1. Desviaciones de escandallo → Problema de registros, no fraude</h3>
          <p className="text-sm text-gray-600">Las desviaciones de inventario oscilan entre -74.266 € (noviembre) y +126.110 € (diciembre) y se deben a errores de introducción de datos en T-Spoon Lab (unidades de medida incorrectas, cantidades con formato numérico erróneo, escandallos mal configurados). No representan pérdida real de mercancía. La cobertura de locales varía por mes, por lo que los totales no son directamente comparables.</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">2. Mermas → Infrarregistro generalizado</h3>
          <p className="text-sm text-gray-600">Con un 0,077% de mermas registradas (1.654,96 €) sobre 2.139.224,67 € de ventas anuales (frente al 0,5–2% esperado en quinta gama), las mermas no se están apuntando. Esto infla artificialmente las desviaciones de escandallo y dificulta el diagnóstico real.</p>
        </div>

        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-bold text-red-800 mb-2">3. Descuadres de caja → Requiere investigación</h3>
          <p className="text-sm text-red-700">El faltante neto total de -49.653 € en caja (siendo -27.757 € solo de Donosti) es significativo y no se explica completamente por errores operativos. Donosti con 129 días de faltante sobre 323 registros es especialmente preocupante.</p>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h3 className="font-bold text-orange-800 mb-2">4. Anulaciones → Anomalía en Pamplona</h3>
          <p className="text-sm text-orange-700">Pamplona concentra el 79,5% de las facturas eliminadas. ARIANNE acumula 165 facturas eliminadas por valor de 11.651 €. Este patrón de concentración en un local y un empleado es anómalo y requiere una revisión detallada de las justificaciones de cada anulación.</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">5. Correlación anulaciones–caja–inventario</h3>
          <p className="text-sm text-gray-600">No se ha encontrado una correlación estadística fuerte y generalizada entre los tres vectores. Sin embargo, se identifican dos patrones diferenciados: en Donosti el problema es de manejo de efectivo (sin anulaciones); en Pamplona el problema es de anulaciones excesivas. Ambos requieren actuaciones distintas.</p>
        </div>
      </div>
    </Card>

    <SectionTitle icon="🎯" title="Recomendaciones" />

    <Card>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Acciones inmediatas</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>Donosti:</strong> Auditoría urgente del manejo de efectivo. Revisar procedimiento de arqueo, verificar si hay ventas no registradas en TPV, considerar mystery shopping.</p>
            <p>• <strong>Pamplona:</strong> Revisar justificación de las 261 facturas eliminadas. Entrevistar a los empleados implicados. Restringir permisos de anulación a encargados.</p>
            <p>• <strong>Todos los locales:</strong> Implementar arqueos de caja con doble verificación en cada cierre de turno.</p>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Acciones estructurales</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Corregir escandallos y protocolo de registro de inventarios en T-Spoon Lab (doble verificación, control de coherencia mensual).</p>
            <p>• Obligar el registro de todas las mermas en cocina con objetivo del 0,5–2%.</p>
            <p>• Limitar permisos de eliminación de facturas y productos a encargados, con motivo documentado obligatorio.</p>
            <p>• Monitorizar mensualmente: ratio de anulaciones por empleado, descuadre de caja por turno, y mermas registradas vs. objetivo.</p>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

// ====== MAIN ======
export default function Report() {
  const [section, setSection] = useState(0);
  const sections = [
    { label: "Resumen", component: <Section1_Resumen /> },
    { label: "Caja", component: <Section2_Caja /> },
    { label: "Facturas", component: <Section3_Facturas /> },
    { label: "Productos", component: <Section4_Productos /> },
    { label: "Mermas", component: <Section5_Mermas /> },
    { label: "Inventario", component: <Section6_Desviaciones /> },
    { label: "Correlación", component: <Section7_Correlacion /> },
    { label: "Conclusiones", component: <Section8_Conclusiones /> },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-2 flex gap-1 overflow-x-auto">
          {sections.map((s, i) => (
            <button key={i} onClick={() => setSection(i)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition ${
                section === i ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
              }`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {sections[section].component}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 text-center text-xs text-gray-400 border-t border-gray-100 mt-8">
        Informe generado a partir de datos de T-Spoon Lab y Last.app · PallaPizza sl — Isla Sicilia · Marzo 2026
      </div>
    </div>
  );
}
