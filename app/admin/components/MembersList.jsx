import styles from "./MembersList.module.css";

export default function MembersList({ members, fetching, onToggle, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Membros Cadastrados</h2>
        <span className={styles.badge}>{members.length}</span>
      </div>

      {fetching ? (
        <p className={styles.empty}>Carregando...</p>
      ) : members.length === 0 ? (
        <div className={styles.emptyBox}>
          <p className={styles.emptyTitle}>Nenhum Membro Cadastrado</p>
          <p className={styles.emptyText}>
            Use o formulário acima para adicionar o primeiro membro.
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {members.map((m) => (
            <div key={m._id} className={styles.row}>
              <div className={styles.avatar}>{m.name[0].toUpperCase()}</div>
              <div className={styles.info}>
                <span className={styles.name}>{m.name}</span>
                <span className={styles.email}>{m.email}</span>
              </div>
              <span
                className={`${styles.status} ${m.isActive ? styles.statusActive : styles.statusInactive}`}
              >
                {m.isActive ? "Ativo" : "Inativo"}
              </span>
              <button className={styles.ghostBtn} onClick={() => onToggle(m._id)}>
                {m.isActive ? "Desativar" : "Ativar"}
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => onDelete(m._id, m.name)}
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
