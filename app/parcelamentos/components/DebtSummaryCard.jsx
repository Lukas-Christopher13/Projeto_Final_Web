"use client";

import styles from "./DebtSummaryCard.module.css";

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DebtSummaryCard({ totalDividas }) {
  return (
    <div className={styles.card}>
      <p className={styles.titulo}>Dívida Futura Total</p>
      <div className={styles.valor}>
        {formatCurrency(totalDividas)}
      </div>
      <p className={styles.descricao}>
        Valores parcelados a vencer nos próximos meses
      </p>
    </div>
  );
}
