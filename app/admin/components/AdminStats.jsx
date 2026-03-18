import styles from "./AdminStats.module.css";

export default function AdminStats({ stats }) {
  const items = [
    { label: "Total de membros", value: stats.totalMembers, color: "#6c63ff" },
    { label: "Membros ativos", value: stats.activeMembers, color: "#059669" },
    { label: "Inativos", value: stats.inactiveMembers, color: "#dc2626" },
  ];

  return (
    <div className={styles.grid}>
      {items.map((st) => (
        <div
          key={st.label}
          className={styles.card}
          style={{ borderLeft: `3px solid ${st.color}` }}
        >
          <p className={styles.value}>{st.value}</p>
          <p className={styles.label}>{st.label}</p>
        </div>
      ))}
    </div>
  );
}
