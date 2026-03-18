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

const MONTHS_EXT = ["Ene25","Feb25","Mar25","Abr25","May25","Jun25","Jul25","Ago25","Sep25","Oct25","Nov25","Dic25","Ene26","Feb26"];

// ====== DATA ======
const descuadreCaja = [
  { city: "Bilbao", neto: -1149.07, falta: -1884.70, sobra: 735.63, dias: 22, registros: 394 },
  { city: "Burgos", neto: -3400.94, falta: -5369.13, sobra: 1968.19, dias: 55, registros: 387 },
  { city: "Donosti", neto: -26835.17, falta: -38688.55, sobra: 11853.38, dias: 138, registros: 371 },
  { city: "Pamplona", neto: -12135.03, falta: -13537.85, sobra: 1402.82, dias: 92, registros: 428 },
  { city: "Vitoria", neto: -5815.89, falta: -8775.02, sobra: 2959.13, dias: 52, registros: 399 },
  { city: "Zaragoza", neto: -3878.94, falta: -7778.95, sobra: 3900.01, dias: 70, registros: 434 },
];

const facturasEliminadas = [
  { city: "Bilbao", count: 22, value: 1106.96 },
  { city: "Burgos", count: 3, value: 199.75 },
  { city: "Donosti", count: 16, value: 738.34 },
  { city: "Pamplona", count: 303, value: 18597.19 },
  { city: "Vitoria", count: 9, value: 542.90 },
  { city: "Zaragoza", count: 43, value: 2322.04 },
];

const productosEliminados = [
  { city: "Bilbao", total: 528, cocina: 631, facturar: 246, value: 6165.70, vCocina: 6813.30, vFacturar: 2328.85 },
  { city: "Burgos", total: 159, cocina: 373, facturar: 50, value: 2204.00, vCocina: 3895.60, vFacturar: 433.50 },
  { city: "Donosti", total: 560, cocina: 873, facturar: 310, value: 8017.45, vCocina: 10416.60, vFacturar: 3245.35 },
  { city: "Pamplona", total: 838, cocina: 1307, facturar: 581, value: 15579.90, vCocina: 14584.80, vFacturar: 7560.45 },
  { city: "Vitoria", total: 297, cocina: 281, facturar: 75, value: 4269.50, vCocina: 3229.70, vFacturar: 773.25 },
  { city: "Zaragoza", total: 933, cocina: 1363, facturar: 527, value: 9168.20, vCocina: 17596.35, vFacturar: 4494.05 },
];

const mermas = [
  { city: "Bilbao", value: 2386.07, items: 109, conCoste: 102, sinCoste: 7 },
  { city: "Burgos", value: 11.69, items: 5, conCoste: 5, sinCoste: 0 },
  { city: "Donosti", value: 1157.29, items: 41, conCoste: 41, sinCoste: 0 },
  { city: "Pamplona", value: 2644.36, items: 87, conCoste: 83, sinCoste: 4 },
  { city: "Vitoria", value: 2730.91, items: 97, conCoste: 82, sinCoste: 15 },
  { city: "Zaragoza", value: 232.63, items: 45, conCoste: 41, sinCoste: 4 },
];

const ventasPorLocal = [
  { city: "Bilbao", ventas: 329173.19 },
  { city: "Burgos", ventas: 270612.70 },
  { city: "Donosti", ventas: 443891.69 },
  { city: "Pamplona", ventas: 593685.15 },
  { city: "Vitoria", ventas: 313189.06 },
  { city: "Zaragoza", ventas: 449254.41 },
];

const desviaciones = [
  { mes: "Ago 25", value: 6674.28, locales: "Bilbao, Burgos" },
  { mes: "Sep 25", value: -1997.82, locales: "Burgos, Donosti, Pamplona, Vitoria, Zaragoza" },
  { mes: "Oct 25", value: 19552.71, locales: "Burgos, Pamplona, Vitoria, Zaragoza" },
  { mes: "Nov 25", value: -74266.76, locales: "Burgos, Pamplona, Vitoria, Zaragoza" },
  { mes: "Dic 25", value: 126110.84, locales: "Bilbao, Burgos, Donosti, Pamplona, Vitoria" },
  { mes: "Ene 26", value: 5984.87, locales: "Bilbao, Burgos, Donosti, Pamplona, Vitoria" },
  { mes: "Feb 26", value: 10006.14, locales: "Bilbao, Burgos, Donosti, Pamplona, Vitoria" },
];

const topEmpleadosFacturas = [
  { name: "ARIANNE", city: "Pamplona", count: 188, value: 12582.78 },
  { name: "UNAX", city: "Pamplona", count: 61, value: 3810.35 },
  { name: "IÑAKI", city: "Pamplona", count: 29, value: 1203.44 },
  { name: "LEA", city: "Pamplona", count: 25, value: 1000.62 },
  { name: "JUDITH", city: "Zaragoza", count: 13, value: 847.60 },
  { name: "SERGIO", city: "Zaragoza", count: 11, value: 604.45 },
  { name: "GABRIEL", city: "Vitoria", count: 8, value: 540.45 },
  { name: "KEVIN", city: "Zaragoza", count: 11, value: 516.50 },
];

const cajaMensual = {
  Bilbao: [{m:1,v:-160.54},{m:2,v:30.52},{m:3,v:0.0},{m:4,v:1.9},{m:5,v:-89.94},{m:6,v:-1082.85},{m:7,v:281.13},{m:8,v:-28.69},{m:9,v:3.75},{m:10,v:-104.37},{m:11,v:0.03},{m:12,v:0.0},{m:13,v:0.0},{m:14,v:-0.01}],
  Burgos: [{m:1,v:-691.52},{m:2,v:73.0},{m:3,v:-386.23},{m:4,v:69.61},{m:5,v:-239.87},{m:6,v:58.71},{m:7,v:-399.96},{m:8,v:19.81},{m:9,v:-10.31},{m:10,v:119.06},{m:11,v:174.1},{m:12,v:-1857.14},{m:13,v:-536.67},{m:14,v:202.93}],
  Donosti: [{m:1,v:0},{m:2,v:-3428.94},{m:3,v:-3397.38},{m:4,v:-7678.87},{m:5,v:-2578.23},{m:6,v:-1741.42},{m:7,v:-5234.1},{m:8,v:-4150.83},{m:9,v:-189.73},{m:10,v:313.79},{m:11,v:260.9},{m:12,v:66.9},{m:13,v:900.68},{m:14,v:38.34}],
  Pamplona: [{m:1,v:-1699.93},{m:2,v:-1741.71},{m:3,v:-0.16},{m:4,v:-320.75},{m:5,v:-3059.26},{m:6,v:-336.39},{m:7,v:179.38},{m:8,v:118.98},{m:9,v:-605.27},{m:10,v:-916.5},{m:11,v:-596.94},{m:12,v:-1696.01},{m:13,v:-613.15},{m:14,v:-847.32}],
  Vitoria: [{m:1,v:0.0},{m:2,v:0.06},{m:3,v:-61.27},{m:4,v:222.51},{m:5,v:-745.1},{m:6,v:-1275.0},{m:7,v:-123.99},{m:8,v:-1137.39},{m:9,v:972.08},{m:10,v:-1386.95},{m:11,v:32.51},{m:12,v:-258.44},{m:13,v:-2057.01},{m:14,v:2.1}],
  Zaragoza: [{m:1,v:-53.11},{m:2,v:-214.65},{m:3,v:69.11},{m:4,v:-442.1},{m:5,v:-190.44},{m:6,v:-1982.98},{m:7,v:-67.2},{m:8,v:-922.18},{m:9,v:-152.3},{m:10,v:2071.26},{m:11,v:-1034.19},{m:12,v:-323.7},{m:13,v:-445.15},{m:14,v:-191.31}],
};

const cajaMensualAll = [];
Object.entries(cajaMensual).forEach(([city, data]) => {
  data.forEach(d => cajaMensualAll.push({ city, month: MONTHS_EXT[d.m - 1], monthNum: d.m, value: d.v }));
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
  const totalVentas = ventasPorLocal.reduce((s, d) => s + d.ventas, 0);
  const pctMerma = ((totalMermas / totalVentas) * 100).toFixed(2);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">INFORME DE ANÁLISIS DE FRAUDE</h1>
        <p className="text-lg text-gray-500 mt-1">PallaPizza — Isla Sicilia</p>
        <p className="text-sm text-gray-400 mt-1">Periodo: Enero 2025 — Febrero 2026 · Fuentes: T-Spoon Lab + Last.app</p>
      </div>

      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <KPI label="Descuadre de caja neto" value={fmt(totalDescuadre)} color="text-red-600" sub="6 locales · Ene25–Feb26" />
          <KPI label="Facturas eliminadas" value={fmt(totalFactElim)} color="text-orange-600" sub={`${facturasEliminadas.reduce((s,d)=>s+d.count,0)} facturas`} />
          <KPI label="Productos eliminados" value={fmt(totalProdElim)} color="text-amber-600" sub={`${productosEliminados.reduce((s,d)=>s+d.total,0)} productos`} />
          <KPI label="Mermas registradas" value={fmt(totalMermas)} color="text-green-700" sub="Periodo completo"
            alert={<Badge color="orange">{pctMerma}% sobre ventas — Bajo</Badge>} />
        </div>
      </Card>

      <AlertBox type="info">
        Este informe analiza tres vectores de posible fraude: descuadres de caja, anulaciones de facturas/productos, y desviaciones de inventario. El objetivo es identificar si existe correlación entre las anulaciones, las ausencias de mercancía y el efectivo no ingresado. Periodo analizado: enero 2025 a febrero 2026.
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
    month: MONTHS_EXT[d.m - 1],
    value: d.v,
  }));

  return (
    <div>
      <SectionTitle icon="💰" title="Descuadres de caja" subtitle="Diferencia entre efectivo esperado (TPV) y efectivo real contado — Ene 2025 a Feb 2026" />

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
        <strong>Donosti</strong> presenta un descuadre neto de <strong>-26.835,17 €</strong>, con 138 de 371 días con faltante de efectivo. Concentrado entre febrero y agosto de 2025 (-28.209 €); de septiembre en adelante el descuadre prácticamente desaparece (+452 €), lo que sugiere que algo cambió (¿empleado, procedimiento?).
      </AlertBox>

      <Card className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-gray-700">Evolución mensual del descuadre (Ene25–Feb26)</h3>
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
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
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
      <SectionTitle icon="🧾" title="Facturas eliminadas" subtitle="Facturas borradas del sistema tras ser generadas — Ene 2025 a Feb 2026" />

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
        <strong>Pamplona concentra el 76,5% de todas las facturas eliminadas</strong> (303 de 396) por un valor de 18.597,19 €. La empleada ARIANNE acumula 188 facturas eliminadas (12.582,78 €). Esta concentración en un solo local y una sola persona es anómala y requiere investigación.
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
      <SectionTitle icon="🍕" title="Productos eliminados" subtitle="Productos borrados de comandas en distintas fases del servicio — Ene 2025 a Feb 2026" />

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
      <SectionTitle icon="🗑️" title="Mermas registradas" subtitle="Producto desechado/caducado registrado en T-Spoon Lab — Ene 2025 a Feb 2026" />

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
            <div className="text-xs text-blue-500">6 locales · Last.app</div>
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
                    <div className="h-2.5 rounded-full bg-green-500" style={{ width: `${Math.min(100, (m.value / 2800) * 100)}%` }}></div>
                  </div>
                </div>
                <div className="w-24 text-right text-gray-800 font-semibold">{fmt(m.value)}</div>
                <div className="w-16 text-right text-gray-500">{m.pct.toFixed(3)}%</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-400">
            Nota: {mermas.reduce((s,d)=>s+d.sinCoste,0)} incidencias registradas sin coste asociado. Burgos y Zaragoza no tienen datos de mermas para enero-febrero 2026. Importes solo incluyen items con coste valorizado.
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
                <div className="h-3 rounded-full bg-red-400" style={{ width: `${Math.min(50, parseFloat(pctGlobal) * 25)}%` }}></div>
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
              Con un <strong>{pctGlobal}%</strong> de mermas registradas sobre {fmt(totalVentas)} de ventas, el registro sigue siendo insuficiente para quinta gama (esperado 0,5–2%). Bilbao, Pamplona y Vitoria han mejorado notablemente con la incorporación de datos de enero-febrero 2026, pero Burgos y Zaragoza siguen con registro mínimo.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Section6_Desviaciones = () => (
  <div>
    <SectionTitle icon="📦" title="Desviaciones de almacén" subtitle="Diferencia entre consumo teórico y real de inventario — T-Spoon Lab" />

    <Card>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {desviaciones.map(d => (
          <div key={d.mes} className={`text-center p-3 rounded-lg ${d.value > 50000 ? "bg-red-50" : d.value < -10000 ? "bg-green-50" : d.value > 10000 ? "bg-orange-50" : "bg-gray-50"}`}>
            <div className="text-xs text-gray-500">{d.mes}</div>
            <div className={`text-sm font-bold ${d.value > 50000 ? "text-red-600" : d.value < 0 ? "text-green-600" : d.value > 10000 ? "text-orange-600" : "text-gray-700"}`}>
              {fmtShort(d.value)}
            </div>
            <div className="text-xs text-gray-400 mt-1 leading-tight" style={{fontSize: 9}}>{d.locales}</div>
          </div>
        ))}
      </div>

      <AlertBox type="warning">
        <strong>Cobertura variable por mes:</strong> no todos los locales tienen desviaciones de almacén registradas cada mes. Agosto solo incluye Bilbao y Burgos; octubre y noviembre no incluyen Bilbao ni Donosti; diciembre no incluye Zaragoza; enero y febrero 2026 no incluyen Zaragoza. Los totales mensuales no son directamente comparables.
      </AlertBox>

      <AlertBox type="info">
        Las desviaciones presentan variaciones extremas (desde -74.266 € hasta +126.110 €). Noviembre y septiembre muestran desviaciones negativas grandes, lo que indica que el consumo teórico supera al real. El análisis producto a producto ha revelado que las desviaciones se deben mayoritariamente a <strong>errores de registro de inventario</strong>: cantidades introducidas con formato numérico incorrecto, confusiones de unidades de medida (g/kg) y escandallos mal configurados. Ejemplo: Panceta Arrotalota en Vitoria (diciembre) genera 110.537 € de desviación (87,7% del total del mes) por un error de cantidad inicial (5.672 Kg registrados en vez de 5,672 Kg).
      </AlertBox>
    </Card>
  </div>
);

const Section7_Correlacion = () => {
  const correlaciones = [
    { city: "Bilbao", factElim: -1149.07, factValue: 1106.96, label: "Bajo riesgo" },
    { city: "Burgos", factElim: -3400.94, factValue: 199.75, label: "Descuadre alto, pocas anulaciones" },
    { city: "Donosti", factElim: -26835.17, factValue: 738.34, label: "Descuadre muy alto, pocas anulaciones" },
    { city: "Pamplona", factElim: -12135.03, factValue: 18597.19, label: "Ambos indicadores altos" },
    { city: "Vitoria", factElim: -5815.89, factValue: 542.90, label: "Moderado" },
    { city: "Zaragoza", factElim: -3878.94, factValue: 2322.04, label: "Moderado" },
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
              <p className="text-xs text-red-700 mt-1">Descuadre de caja de -26.835 € con relativamente pocas anulaciones (16 facturas). El problema se concentró entre febrero y agosto 2025 y desapareció en septiembre. Esto sugiere un problema puntual con el manejo de efectivo, posiblemente vinculado a un empleado o turno específico.</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="font-bold text-orange-800 text-sm">🟠 Pamplona — Patrón de anulaciones</div>
              <p className="text-xs text-orange-700 mt-1">303 facturas eliminadas (18.597 €) + descuadre de caja de -12.135 €. ARIANNE acumula 188 facturas eliminadas (12.582 €). El volumen de anulaciones sigue creciendo y está vinculado al faltante de caja.</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="font-bold text-yellow-800 text-sm">🟡 Vitoria — Aumento reciente</div>
              <p className="text-xs text-yellow-700 mt-1">El descuadre ha subido a -5.815 € con un pico notable en enero 2026 (-2.057 €). Este aumento reciente requiere seguimiento para determinar si es un cambio de tendencia o un evento puntual.</p>
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
          <h3 className="font-bold text-gray-800 mb-2">1. Desviaciones de almacén → Problema de registros, no fraude</h3>
          <p className="text-sm text-gray-600">Las desviaciones de inventario oscilan entre -74.266 € (noviembre) y +126.110 € (diciembre) y se deben a errores de introducción de datos en T-Spoon Lab (unidades de medida incorrectas, cantidades con formato numérico erróneo, escandallos mal configurados). La cobertura de locales varía por mes, por lo que los totales no son directamente comparables. Los datos de enero y febrero 2026 (5.984 € y 10.006 € respectivamente) se mantienen en rango moderado.</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">2. Mermas → Mejora parcial, aún insuficiente</h3>
          <p className="text-sm text-gray-600">Con la incorporación de datos de enero-febrero 2026, las mermas totales ascienden a 9.162,95 € (0,382% sobre ventas). Esto supone una mejora notable frente al 0,077% del periodo anterior, pero sigue por debajo del 0,5–2% esperado en quinta gama. Bilbao, Donosti, Pamplona y Vitoria muestran mejora significativa; Burgos y Zaragoza siguen con registro mínimo.</p>
        </div>

        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-bold text-red-800 mb-2">3. Descuadres de caja → Requiere investigación</h3>
          <p className="text-sm text-red-700">El faltante neto total de -53.215 € en caja (siendo -26.835 € de Donosti) es significativo. En Donosti el descuadre se detuvo en septiembre 2025; en Pamplona sigue activo y creciendo. Vitoria muestra un pico preocupante en enero 2026 (-2.057 €).</p>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h3 className="font-bold text-orange-800 mb-2">4. Anulaciones → Anomalía persistente en Pamplona</h3>
          <p className="text-sm text-orange-700">Pamplona concentra el 76,5% de las facturas eliminadas (303 de 396). ARIANNE acumula 188 facturas eliminadas por valor de 12.582 €. Respecto al periodo anterior, se han añadido 68 facturas nuevas (23 de ARIANNE, 19 de UNAX). El patrón no solo persiste sino que se intensifica.</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">5. Correlación anulaciones–caja–inventario</h3>
          <p className="text-sm text-gray-600">No se ha encontrado una correlación estadística fuerte y generalizada entre los tres vectores. Sin embargo, se mantienen dos patrones diferenciados: en Donosti el problema fue de manejo de efectivo (concentrado feb-ago 2025, ya resuelto); en Pamplona el problema es de anulaciones excesivas y sigue activo. Vitoria requiere seguimiento por el pico de enero 2026.</p>
        </div>
      </div>
    </Card>

    <SectionTitle icon="🎯" title="Recomendaciones" />

    <Card>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Acciones inmediatas</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>Pamplona:</strong> Revisar las 303 facturas eliminadas. Restringir permisos de anulación de ARIANNE y UNAX a supervisión de encargado. Exigir motivo documentado.</p>
            <p>• <strong>Donosti:</strong> Identificar qué cambió en septiembre 2025 que detuvo el descuadre. Documentar el control implementado para replicarlo en otros locales.</p>
            <p>• <strong>Vitoria:</strong> Investigar el pico de enero 2026 (-2.057 €). Verificar si hubo cambio de personal o de procedimiento.</p>
            <p>• <strong>Todos los locales:</strong> Implementar arqueos de caja con doble verificación en cada cierre de turno.</p>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Acciones estructurales</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Corregir escandallos y protocolo de registro de inventarios en T-Spoon Lab (doble verificación, control de coherencia mensual).</p>
            <p>• Mantener el avance en registro de mermas. Burgos y Zaragoza necesitan empezar a registrar.</p>
            <p>• Limitar permisos de eliminación de facturas y productos a encargados, con motivo documentado obligatorio.</p>
            <p>• Monitorizar mensualmente: ratio de anulaciones por empleado, descuadre de caja por turno, y mermas registradas vs. objetivo 0,5%.</p>
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
        Informe generado a partir de datos de T-Spoon Lab y Last.app · PallaPizza sl — Isla Sicilia · Periodo: Enero 2025 — Febrero 2026 · Marzo 2026
      </div>
    </div>
  );
}
