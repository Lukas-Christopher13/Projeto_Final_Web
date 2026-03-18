import styles from "./SummaryCards.module.css";

export default function SummaryCards({ summary, formatCurrency }) {
  const balPos = summary.balance >= 0;

  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.cardIncome}`}>
        <p className={styles.label}>Total de Entradas</p>
        <p className={styles.valueIncome}>{formatCurrency(summary.income)}</p>
      </div>
      <div className={`${styles.card} ${styles.cardExpense}`}>
        <p className={styles.label}>Total de Saídas</p>
        <p className={styles.valueExpense}>{formatCurrency(summary.expense)}</p>
      </div>
      <div className={`${styles.card} ${balPos ? styles.cardBalancePos : styles.cardBalanceNeg}`}>
        <p className={styles.label}>Saldo Líquido</p>
        <p className={balPos ? styles.valueBalancePos : styles.valueBalanceNeg}>
          {formatCurrency(summary.balance)}
        </p>
        <p className={styles.balanceHint}>
          {balPos ? "Saldo positivo ✓" : "Saldo negativo !"}
        </p>
      </div>
    </div>
  );
}
