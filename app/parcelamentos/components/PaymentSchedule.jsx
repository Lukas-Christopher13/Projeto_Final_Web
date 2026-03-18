"use client";

import styles from "./PaymentSchedule.module.css";

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PaymentSchedule({ resumoMensal }) {
  const ordemMeses = {
    janeiro: 0,
    fevereiro: 1,
    março: 2,
    abril: 3,
    maio: 4,
    junho: 5,
    julho: 6,
    agosto: 7,
    setembro: 8,
    outubro: 9,
    novembro: 10,
    dezembro: 11,
  };

  const meses = Object.entries(resumoMensal)
    .sort(([mesA], [mesB]) => {
      const [nomeMesA, anoA] = mesA.split(" de ");
      const [nomeMesB, anoB] = mesB.split(" de ");

      const dataA = new Date(Number(anoA), ordemMeses[nomeMesA], 1);
      const dataB = new Date(Number(anoB), ordemMeses[nomeMesB], 1);

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
