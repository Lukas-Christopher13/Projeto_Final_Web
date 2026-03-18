import styles from "./MonthNavigator.module.css";

export default function MonthNavigator({
  monthLabel,
  year,
  isCurrentMonth,
  onPrev,
  onNext,
  onCurrent,
}) {
  return (
    <div className={styles.nav}>
      <button className={styles.navBtn} onClick={onPrev} type="button">
        ‹
      </button>
      <div className={styles.monthLabel}>
        <span className={styles.month}>{monthLabel}</span>
        <span className={styles.year}>{year}</span>
      </div>
      <button className={styles.navBtn} onClick={onNext} type="button">
        ›
      </button>
      {!isCurrentMonth && (
        <button className={styles.currentBtn} onClick={onCurrent} type="button">
          Mês atual
        </button>
      )}
    </div>
  );
}
