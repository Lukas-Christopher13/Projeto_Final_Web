"use client"

import { useState } from "react"
import Grafico from "./grafico"
import Total from "./Total"
import AdicionarAReserva from "./adicionar_a_reserva"
import Historico from "./historico"

import styles from "@/app/reserva_investimento/page.module.css"

export default function ReservasInvestimentos() {
    const [aportes, setAportes] = useState([])

    return (
        <main className={styles.reserva_investimento}>
            <h1 className={styles.titulo}>Minhas Reservas</h1>
            
            <Grafico aportes={aportes} setAportes={setAportes}></Grafico>
            <Total aportes={aportes} setAportes={setAportes}></Total>
            <AdicionarAReserva aportes={aportes} setAportes={setAportes}></AdicionarAReserva>
            <Historico aportes={aportes} setAportes={setAportes}></Historico>

        </main>
    )
}