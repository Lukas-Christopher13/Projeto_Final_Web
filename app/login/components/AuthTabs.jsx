import styles from "./AuthTabs.module.css";

export default function AuthTabs({ activeTab, onChange }) {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${activeTab === "login" ? styles.tabActive : ""}`}
        onClick={() => onChange("login")}
        type="button"
      >
        Entrar
      </button>
      <button
        className={`${styles.tab} ${activeTab === "register" ? styles.tabActive : ""}`}
        onClick={() => onChange("register")}
        type="button"
      >
        Criar conta
      </button>
    </div>
  );
}
