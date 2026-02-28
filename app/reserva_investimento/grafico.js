"use client"

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend
} from 'recharts'

import styles  from "@/app/reserva_investimento/grafico.module.css"

const dados = [
    { data: "2026-01-01", valor: 1000 },
    { data: "2026-02-01", valor: 1500 },
    { data: "2026-03-01", valor: 2200 },
    { data: "2026-04-01", valor: 3100 },
    { data: "2026-05-01", valor: 4200 },
    { data: "2026-06-01", valor: 5800 }
]

export default function Grafico() {
    return (
        <main className={styles.container}>
            <p className={styles.titulo}>Evolução das Reservas</p>
            <figure className={styles.grafico}>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dados}>
                        <Legend
                            iconType="rect" 
                            verticalAlign="top" 
                            align="center"
                        />
                        <CartesianGrid stroke="#e5e7eb" />
                        <XAxis 
                            dataKey="data"
                            tickMargin={15}
                        />
                        <YAxis dataKey="valor" />
                        <Tooltip />
                        <Area 
                            type="monotone" 
                            dataKey="valor" 
                            name="Total Acumulado"
                            stroke="#16a34a"
                            fill="#16a34a" 
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </figure>
        </main>
    )
}