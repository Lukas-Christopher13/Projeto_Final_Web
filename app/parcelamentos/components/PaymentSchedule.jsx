"use client";

import styles from "./PaymentSchedule.module.css";

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PaymentSchedule({ resumoMensal }) {
  const meses = Object.entries(resumoMensal).sort((a, b) => {
    const dataA = new Date(a[0]);
    const dataB = new Date(b[0]);
    return dataA - dataB;
  });

  if (meses.length === 0) {
    return (
      <div className={styles.card}>
        <h3 className={styles.titulo}>Resumo Mensal (Geral)</h3>
        <p className={styles.vazio}>
          Nenhuma dívida futura encontrada
        </p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.titulo}>Resumo Mensal (Geral)</h3>
      
      <div className={styles.lista}>
        {meses.map(([mes, total]) => (
          <div key={mes} className={styles.item}>
            <span className={styles.mes}>
              {mes}
            </span>
            <span className={styles.valor}>
              {formatCurrency(total)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
