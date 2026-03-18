import styles from "./RegisterForm.module.css";

export default function RegisterForm({
  loading,
  name,
  email,
  password,
  confirm,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmChange,
  onSubmit,
  onSwitch,
}) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Nome completo</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>E-mail</label>
        <input
          className={styles.input}
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          Senha <span className={styles.hint}>(mín. 6 caracteres)</span>
        </label>
        <input
          className={styles.input}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Confirmar senha</label>
        <input
          className={styles.input}
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => onConfirmChange(e.target.value)}
        />
      </div>
      <button className={styles.btnPrimary} type="submit" disabled={loading}>
        {loading ? "Criando conta..." : "Criar conta"}
      </button>
      <p className={styles.switchText}>
        Já tem conta?{" "}
        <button type="button" className={styles.switchBtn} onClick={onSwitch}>
          Entrar
        </button>
      </p>
    </form>
  );
}
