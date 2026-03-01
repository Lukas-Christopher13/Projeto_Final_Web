"use client"

import { useEffect, useState } from "react"
import styles from "@/app/reserva_investimento/total.module.css"


export default function Total() {
    const valorInicial = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(0)

    const [total, setTotal] = useState(valorInicial);

    useEffect(() => {
        async function getTotal() {
            const response = await fetch("/api/aportes/total")
            const result = await response.json()
            setTotal(result.valorTotal)
        }
        getTotal()
    }, []);

    return(
        <main className={styles.total}>
            <p className={styles.titulo}>Total Guardado Atualmente</p>
            <p className={styles.total_guardado}> {total} </p>
        </main>
    )
}