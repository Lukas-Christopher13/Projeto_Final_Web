import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import styles from "./ChartsSection.module.css";

export default function ChartsSection({
  pieData,
  barData,
  colors,
  monthLabel,
  formatCurrency,
  formatShort,
}) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h3 className={styles.title}>🍕 Despesas por Categoria</h3>
        {pieData.length === 0 ? (
          <p className={styles.empty}>Nenhuma despesa em {monthLabel}</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{
                  background: "#fff",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <Legend
                formatter={(v) => (
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{v}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className={styles.card}>
        <h3 className={styles.title}>📊 Receitas vs Despesas</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} barSize={56}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f3f4f6"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatShort}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => formatCurrency(v)}
              contentStyle={{
                background: "#fff",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
