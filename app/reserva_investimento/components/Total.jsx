"use client"

import { useEffect, useState } from "react"
import styles from "@/app/reserva_investimento/components/total.module.css"


export default function Total(props) {
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
            props.setAportes(props.aportes)
        }
        getTotal()
    }, [props.aportes, props.setAportes]);

    return(
        <main className={styles.total}>
            <p className={styles.titulo}>Total Guardado Atualmente</p>
            <p className={styles.total_guardado}> {total} </p>
        </main>
    )
}