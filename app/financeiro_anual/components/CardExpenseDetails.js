"use client";

import { useEffect, useState } from "react";
import Card from "./Card";
import styles from "./CardExpenseDetails.module.css"

export default function CardExpenseDetails(props) {
    const [gastosPorCartao, setGastosPorCartao] = useState([]);

    useEffect(() => {
        async function getGastosPorCartao() {
            const response = await fetch((`/api/cartoes/despesas_por_cartao/${props.anoAtual}`));
            const gastos = await response.json();
            setGastosPorCartao(gastos)
        }
        getGastosPorCartao();
    }, [props.anoAtual]);

    return (
        <div className={styles.card_expense_details}>
            <h1>Despesas por Conta/Cartão</h1>
    
            <table className={styles.table}>
                <tbody>
                    {gastosPorCartao.map((cartao) => (
                        <tr key={cartao.id} className={styles.table_row}>
                            <th><Card nome={cartao.nome}/></th>
                            <th><p>R$ {cartao.total.toFixed(2)}</p></th>
                        </tr>
                    ))}
                   
                    <tr className={styles.table_row}>
                        <th>Boleto/Pix</th>
                        <th><p>R$ 1000,00</p></th>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

