import styles from "./TransactionsList.module.css";

export default function TransactionsList({
  transactions,
  monthLabel,
  year,
  fetching,
  formatCurrency,
  formatDate,
  onDelete,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Transações — {monthLabel} {year}
        </h3>
        <span className={styles.badge}>{transactions.length}</span>
      </div>

      {fetching ? (
        <p className={styles.empty}>Carregando...</p>
      ) : transactions.length === 0 ? (
        <p className={styles.empty}>
          Nenhuma transação em {monthLabel} {year}
        </p>
      ) : (
        <div className={styles.list}>
          {transactions.map((tx) => (
            <div key={tx._id} className={styles.row}>
              <div
                className={`${styles.dot} ${tx.type === "income" ? styles.dotIncome : styles.dotExpense}`}
              />
              <div className={styles.info}>
                <span className={styles.desc}>{tx.description}</span>
                <span className={styles.meta}>
                  {tx.category} · {formatDate(tx.date)}
                </span>
              </div>
              <span
                className={`${styles.amount} ${tx.type === "income" ? styles.amountIncome : styles.amountExpense}`}
              >
                {tx.type === "income" ? "+" : "−"} {formatCurrency(tx.amount)}
              </span>
              <button
                className={styles.deleteBtn}
                onClick={() => onDelete(tx._id, tx.source)}
                type="button"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
