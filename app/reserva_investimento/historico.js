"use client"

import styles  from "@/app/reserva_investimento/historico.module.css"
import ExportarHistoricoButton from "./components/ExportarHistoricoButton"
import { useEffect, useState } from "react"


export default function Historico() {
    const [aports, setAportes] = useState([])

    useEffect(() => {
        async function getAportes() {
            const response = await fetch("/api/aportes")
            const result = await response.json()
            setAportes(result)
        }
        getAportes()
    }, [])

    return (
        <main className={styles.historico}>

            <header className={styles.header} >
                <p className={styles.titulo}>Histórico de Reservas</p>
                <ExportarHistoricoButton />
            </header>

            <table className={styles.tabela}>
                <thead className={styles.cabesalho_tabela}>
                    <tr>
                        <th>FONTE</th>
                        <th>VALOR</th>
                        <th>DATA</th>
                        <th>AÇÕES</th>
                    </tr>
                </thead>
                <tbody className={styles.linhas_tabela}>
                    {aports.map((reserva) => (
                    <tr key={reserva.id}>
                        <td>{reserva.fonte}</td>
                        <td>R$ {reserva.valor}</td>
                        <td>{reserva.data}</td>
                        <td>Ação</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}