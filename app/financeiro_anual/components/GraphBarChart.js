"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer
} from "recharts";

import styles from './GraphBarChart.module.css';

const data = [
  { mes: "Jan", renda: 5000, despesa: 3200 },
  { mes: "Fev", renda: 4800, despesa: 3000 },
  { mes: "Mar", renda: 5200, despesa: 3500 },
  { mes: "Abr", renda: 5100, despesa: 3300 },
  { mes: "Mai", renda: 5300, despesa: 3600 },
  { mes: "Jun", renda: 5500, despesa: 3700 },
  { mes: "Jul", renda: 5400, despesa: 3900 },
  { mes: "Ago", renda: 5600, despesa: 4100 },
  { mes: "Set", renda: 5800, despesa: 4200 },
  { mes: "Out", renda: 6000, despesa: 4500 },
  { mes: "Nov", renda: 6200, despesa: 4600 },
  { mes: "Dez", renda: 6500, despesa: 4800 }
];

export default function GraphBarChart() {
    return (
        <div className={styles.GraphbarChart}>
            <h1>Rendas vs. Despesas Mensais</h1>
            <div className={styles.graph}>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" />
                        
                        <XAxis dataKey="mes" />
                        <YAxis />

                        <Tooltip />
                        <Legend
                            iconType="rect" 
                            verticalAlign="top" 
                            align="center"
                        />

                        <Bar dataKey="renda" name="Renda" fill="#16a34a" >
                            <LabelList dataKey="renda" fill="#000" position="center" />
                        </Bar>
                        <Bar dataKey="despesa" name="Despesa" fill="#dc2626">
                            <LabelList dataKey="despesa" fill="#000" position="center" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
