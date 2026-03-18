import styles from "./LoginForm.module.css";

export default function LoginForm({
  loading,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSwitch,
}) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>E-mail</label>
        <input
          className={styles.input}
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Senha</label>
        <input
          className={styles.input}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      <button className={styles.btnPrimary} type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <p className={styles.switchText}>
        Não tem conta?{" "}
        <button type="button" className={styles.switchBtn} onClick={onSwitch}>
          Criar conta
        </button>
      </p>
    </form>
  );
}
