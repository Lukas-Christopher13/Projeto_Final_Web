'use client';

import { useEffect, useState } from 'react';
import styles from './AnnualSummary.module.css';

export default function AnnualSummary(props) {
    const valorInicial = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(0)

    const [totalRendas, setTotalRendas] = useState(valorInicial);
    const [totalDespesas, setTotalDespesas] = useState(valorInicial);
    const [saldoFinal, setSaldoFinal] = useState(valorInicial);

    useEffect(() => {
        async function fetchTotais() {
            const rendaTotal = await fetch(`/api/rendas/total/${props.anoAtual}`);
            const despesaTotal = await fetch(`/api/despesas/total/${props.anoAtual}`);


            const renda = await rendaTotal.json();
            const despesas = await despesaTotal.json();
            const saldo = renda - despesas;

            setTotalRendas(Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
            }).format(renda));

            setTotalDespesas(Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
            }).format(despesas));

            setSaldoFinal(Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
            }).format(saldo));
        }
        fetchTotais();
    }, [props.anoAtual]);
        
    return (
        <div className={styles.annual_summary}>
            <h1>Relatório Financeiro Anual</h1>
            <h2>Resumo do ano tall</h2>

            <div className={styles.resumo}>

                <div className={styles.renda}>
                    <p className={styles.titulo}>Total de Rendas do Ano </p>
                    <p className={styles.valor}>{totalRendas}</p>
                </div>

                <div className={styles.despesa}>
                    <p className={styles.titulo}>Total de Despesas do Ano</p>
                    <p className={styles.valor}>{totalDespesas}</p>
                </div>

                <div className={styles.saldo}>
                    <p className={styles.titulo}>Saldo Final do Ano</p>
                    <p className={styles.valor}>{saldoFinal}</p>
                </div>

            </div>
        </div>
    );
}