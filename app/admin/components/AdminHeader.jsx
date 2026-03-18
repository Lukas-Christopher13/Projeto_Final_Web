import styles from "./AdminHeader.module.css";

export default function AdminHeader() {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Painel de Administração</h1>
      <p className={styles.subtitle}>
        Gerenciamento de membros e dados da aplicação.
      </p>
    </div>
  );
}
