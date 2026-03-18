import styles from "./NewTransactionForm.module.css";

export default function NewTransactionForm({
  form,
  categories,
  submitting,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Nova Transação</h3>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Tipo</label>
            <select
              className={styles.input}
              value={form.type}
              onChange={(e) =>
                onChange({
                  ...form,
                  type: e.target.value,
                  category: categories[e.target.value][0],
                })
              }
            >
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Categoria</label>
            <select
              className={styles.input}
              value={form.category}
              onChange={(e) => onChange({ ...form, category: e.target.value })}
            >
              {categories[form.type].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className={`${styles.field} ${styles.fieldGrow}`}>
            <label className={styles.label}>Descrição</label>
            <input
              className={styles.input}
              placeholder="Ex: Supermercado"
              value={form.description}
              onChange={(e) =>
                onChange({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Valor (R$)</label>
            <input
              className={styles.input}
              type="number"
              placeholder="0,00"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => onChange({ ...form, amount: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Data</label>
            <input
              className={styles.input}
              type="date"
              value={form.date}
              onChange={(e) => onChange({ ...form, date: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.saveBtn} type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
