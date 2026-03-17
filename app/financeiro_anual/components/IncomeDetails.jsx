"use client";

import { useState, useEffect } from 'react';

import styles from './IncomeDetails.module.css';

export default function IncomeDetails(props) {
    const [rendas, setRendas] = useState([]);

    useEffect(() => {
        async function getRendas() {
            try {
                const response = await fetch(`/api/rendas/por-ano/${props.anoAtual}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const dados = await response.json();
                setRendas(Array.isArray(dados) ? dados : []);
            } catch (error) {
                console.error("Erro ao buscar rendas:", error);
                setRendas([]);
            }
        }
        getRendas();
    }, [props.anoAtual]);

    return (
        <div className={styles.income_details}>
            <h1>Detalhamento de Rendas no Ano</h1>
            <div className={styles.table_container}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rendas.map((renda) => (
                            <tr key={renda._id}>
                                <td>{new Date(renda.data).toLocaleDateString("pt-BR")}</td>
                                <td>{renda.descricao}</td>
                                <td>{Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                }).format(renda.valor)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
