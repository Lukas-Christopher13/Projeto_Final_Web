import styles from "./AddMemberForm.module.css";

export default function AddMemberForm({ form, submitting, onChange, onSubmit }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Adicionar Novo Membro</h2>
      <form onSubmit={onSubmit} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Nome"
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
        />
        <input
          className={styles.input}
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={(e) => onChange({ ...form, email: e.target.value })}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Senha Temporária"
          value={form.password}
          onChange={(e) => onChange({ ...form, password: e.target.value })}
        />
        <button className={styles.primaryBtn} type="submit" disabled={submitting}>
          {submitting ? "Adicionando..." : "+ Adicionar"}
        </button>
      </form>
    </div>
  );
}
