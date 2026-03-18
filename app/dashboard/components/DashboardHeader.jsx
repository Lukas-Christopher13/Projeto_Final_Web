import styles from "./DashboardHeader.module.css";

export default function DashboardHeader({ userName, onToggleForm }) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>
          Olá,{" "}
          <em className={styles.userName}>{userName}</em>{" "}
          👋
        </h1>
        <p className={styles.subtitle}>Visão financeira mensal</p>
      </div>
      <button className={styles.newButton} onClick={onToggleForm} type="button">
        + Nova Transação
      </button>
    </div>
  );
}
