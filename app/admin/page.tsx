"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser]       = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [stats, setStats]     = useState({ totalMembers: 0, activeMembers: 0, inactiveMembers: 0 });
  const [fetching, setFetching]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]   = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!token || !savedUser) { router.push("/login"); return; }
    const u = JSON.parse(savedUser);
    if (u.role !== "admin") { router.push("/dashboard"); return; }
    setUser(u);
  }, []);

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const [membersRes, statsRes] = await Promise.all([
        fetch("/api/admin/members", { headers }),
        fetch("/api/admin/stats", { headers }),
      ]);
      const mData = await membersRes.json();
      const sData = await statsRes.json();
      if (mData.success) setMembers(mData.members);
      if (sData.success) setStats(sData.stats);
    } catch { setMsg("Erro ao carregar dados."); }
    finally { setFetching(false); }
  }, [token]);

  useEffect(() => { if (user) fetchData(); }, [user, fetchData]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setMsg("Preencha todos os campos."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/members", { method: "POST", headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) { setForm({ name: "", email: "", password: "" }); setMsg(""); fetchData(); }
      else setMsg(data.message || "Erro ao adicionar membro.");
    } catch { setMsg("Erro ao conectar."); }
    finally { setSubmitting(false); }
  };

  const handleToggle = async (id: string) => {
    await fetch(`/api/admin/members/${id}/toggle`, { method: "PATCH", headers });
    fetchData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir permanentemente "${name}"?`)) return;
    await fetch(`/api/admin/members/${id}`, { method: "DELETE", headers });
    fetchData();
  };

  return (
    <div style={s.page}>
      <main style={s.main}>
        <div style={{ marginBottom: 8 }}>
          <h1 style={s.pageTitle}>Painel de Administração</h1>
          <p style={s.pageSub}>Gerenciamento de membros e dados da aplicação.</p>
        </div>

        {msg && <div style={s.errorMsg}>{msg}</div>}

        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { label: "Total de membros", value: stats.totalMembers,    color: "#6c63ff" },
            { label: "Membros ativos",   value: stats.activeMembers,   color: "#059669" },
            { label: "Inativos",         value: stats.inactiveMembers, color: "#dc2626" },
          ].map((st) => (
            <div key={st.label} style={{ ...s.card, borderLeft: `3px solid ${st.color}` }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 36, color: "#1a1835", letterSpacing: -1, lineHeight: 1, marginBottom: 8 }}>{st.value}</p>
              <p style={{ fontSize: 12, color: "#9491b4", textTransform: "uppercase", letterSpacing: 0.8 }}>{st.label}</p>
            </div>
          ))}
        </div>

        {/* Adicionar membro */}
        <div style={s.card}>
          <h2 style={s.sectionTitle}>Adicionar Novo Membro</h2>
          <form onSubmit={handleAdd} style={s.addForm}>
            <input style={s.input} placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={s.input} type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input style={s.input} type="password" placeholder="Senha Temporária" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button style={s.btnPrimary} type="submit" disabled={submitting}>
              {submitting ? "Adicionando..." : "+ Adicionar"}
            </button>
          </form>
        </div>

        {/* Lista de membros */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <h2 style={s.sectionTitle}>Membros Cadastrados</h2>
            <span style={s.badge}>{members.length}</span>
          </div>

          {fetching ? <p style={s.empty}>Carregando...</p> : members.length === 0 ? (
            <div style={s.emptyBox}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#4b4870" }}>Nenhum Membro Cadastrado</p>
              <p style={{ fontSize: 13, color: "#9491b4" }}>Use o formulário acima para adicionar o primeiro membro.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {members.map((m: any) => (
                <div key={m._id} style={s.memberRow}>
                  <div style={s.avatar}>{m.name[0].toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={s.memberName}>{m.name}</span>
                    <span style={s.memberEmail}>{m.email}</span>
                  </div>
                  <span style={{ ...s.statusBadge, background: m.isActive ? "#d1fae5" : "#fee2e2", color: m.isActive ? "#059669" : "#dc2626" }}>
                    {m.isActive ? "Ativo" : "Inativo"}
                  </span>
                  <button style={s.btnGhost} onClick={() => handleToggle(m._id)}>
                    {m.isActive ? "Desativar" : "Ativar"}
                  </button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(m._id, m.name)}>🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f0f2f8", fontFamily: "sans-serif" },
  navbar: { position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(108,99,255,0.1)", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
  navInner: { maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 32 },
  navLogo: { fontWeight: 700, fontSize: 18, color: "#1a1835" },
  nav: { display: "flex", gap: 4, flex: 1 },
  navLink: { textDecoration: "none", fontSize: 14, fontWeight: 500, color: "#4b4870", padding: "6px 14px", borderRadius: 8 },
  navLinkActive: { textDecoration: "none", fontSize: 14, fontWeight: 600, color: "#6c63ff", padding: "6px 14px", borderRadius: 8, background: "rgba(108,99,255,0.08)" },
  navUser: { display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" },
  navUserName: { fontSize: 13, fontWeight: 600, color: "#1a1835" },
  logoutBtn: { background: "none", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#4b4870", cursor: "pointer" },
  main: { maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 24 },
  pageTitle: { fontFamily: "Georgia, serif", fontSize: 30, color: "#1a1835", letterSpacing: -0.5 },
  pageSub: { fontSize: 14, color: "#9491b4", marginTop: 6 },
  errorMsg: { background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 13 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
  card: { background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#1a1835", marginBottom: 20 },
  addForm: { display: "flex", gap: 12, flexWrap: "wrap" as const },
  input: { flex: 1, minWidth: 180, background: "#f5f7fc", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#1a1835", outline: "none", boxSizing: "border-box" as const },
  btnPrimary: { display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#6c63ff", color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" as const },
  btnGhost: { background: "transparent", color: "#4b4870", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer" },
  badge: { background: "rgba(108,99,255,0.1)", color: "#6c63ff", borderRadius: 20, fontSize: 11, fontWeight: 700, padding: "2px 10px" },
  empty: { color: "#9491b4", fontSize: 13, textAlign: "center" as const, padding: "32px 0" },
  emptyBox: { display: "flex", flexDirection: "column" as const, alignItems: "center", padding: "48px 24px", gap: 8, border: "1px dashed rgba(108,99,255,0.3)", borderRadius: 12 },
  memberRow: { display: "flex", alignItems: "center", gap: 14, padding: "14px 12px", borderRadius: 12, borderBottom: "1px solid #f0f2f8", transition: "background 0.15s" },
  avatar: { width: 38, height: 38, borderRadius: "50%", background: "rgba(108,99,255,0.1)", border: "2px solid #6c63ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#6c63ff", flexShrink: 0 },
  memberName: { display: "block", fontSize: 14, fontWeight: 600, color: "#1a1835" },
  memberEmail: { display: "block", fontSize: 12, color: "#9491b4" },
  statusBadge: { fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" as const },
  deleteBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.5, padding: 4 },
};
