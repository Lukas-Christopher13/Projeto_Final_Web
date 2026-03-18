import styles from "./TopExpenses.module.css";

export default function TopExpenses({ expenses, totalExpense, colors, monthLabel, formatCurrency, formatDate }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>🏆 Ranking — 5 Maiores Despesas</h3>
      {expenses.length === 0 ? (
        <p className={styles.empty}>Nenhuma despesa em {monthLabel}</p>
      ) : (
        <div className={styles.list}>
          {expenses.map((tx, i) => {
            const pct = totalExpense > 0 ? (tx.amount / totalExpense) * 100 : 0;
            return (
              <div key={tx._id} className={styles.row}>
                <div
                  className={`${styles.rank} ${i === 0 ? styles.rankTop : styles.rankDefault}`}
                >
                  {i + 1}º
                </div>
                <div className={styles.info}>
                  <div className={styles.infoHeader}>
                    <span className={styles.desc}>{tx.description}</span>
                    <span className={styles.amount}>{formatCurrency(tx.amount)}</span>
                  </div>
                  <p className={styles.meta}>
                    {tx.category} · {formatDate(tx.date)} · {pct.toFixed(1)}% do total
                  </p>
                  <div className={styles.bar}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${pct}%`,
                        background: colors[i % colors.length],
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
