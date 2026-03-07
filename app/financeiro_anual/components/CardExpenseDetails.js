"use client";

import { useEffect, useState } from "react";
import Card from "./Card";
import styles from "./CardExpenseDetails.module.css"

export default function CardExpenseDetails(props) {
    const [gastosPorCartao, setGastosPorCartao] = useState([]);
    const [gastosBoletoPix, setGastoBoletoPix] = useState(0);

    useEffect(() => {
        async function getGastos() {
            const cartao = await fetch((`/api/cartoes/despesas_por_cartao/${props.anoAtual}`));
            const boletoPix = await fetch((`/api/despesas/total/conta_corrente/${props.anoAtual}`));

            const gastos = await cartao.json();
            const gastoBoletoPix = await boletoPix.json();

            setGastosPorCartao(gastos);
            setGastoBoletoPix(Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
            }).format(gastoBoletoPix));
        }
        getGastos();
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
                        <th><p>{gastosBoletoPix}</p></th>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

