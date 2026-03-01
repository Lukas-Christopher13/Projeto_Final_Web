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
import { useEffect, useState } from 'react'

import styles  from "@/app/reserva_investimento/grafico.module.css"


export default function Grafico() {
    const [dados, setDados] = useState([])

    useEffect(() => {
        async function getDados() {
            const response = await fetch("/api/aportes/total_acumulado");
            const data = await response.json();
            setDados(data)
        }
        getDados()
    }, [])
    
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