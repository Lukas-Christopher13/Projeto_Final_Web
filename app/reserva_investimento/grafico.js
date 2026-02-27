"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

import styles  from "@/app/reserva_investimento/page.module.css"

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
        <main>
            <p className={styles.titulo_do_grafico} >Evolução das Reservas</p>
            <figure className={styles.conteudo_do_grafico}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dados}>
                        <XAxis dataKey="data" />
                        <YAxis dataKey="valor" />
                        <Tooltip />
                        <Line type="monotone" dataKey="valor" stroke="#2563eb" />
                    </LineChart>
                </ResponsiveContainer>
            </figure>
        </main>
    )
}