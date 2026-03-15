'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import styles from './admin.module.css';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({ totalMembers: 0, activeMembers: 0 });
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) return router.push('/login');
      if (user.role !== 'admin') return router.push('/dashboard');
    }
  }, [user, loading, router]);

  const fetchData = useCallback(async () => {
    try {
      const [membersRes, statsRes] = await Promise.all([
        api.get('/admin/members'),
        api.get('/admin/stats'),
      ]);
      setMembers(membersRes.data.members);
      setStats(statsRes.data.stats);
    } catch {
      toast.error('Erro ao carregar dados.');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') fetchData();
  }, [user, fetchData]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return toast.error('Preencha todos os campos.');
    }
    setSubmitting(true);
    try {
      await api.post('/admin/members', form);
      toast.success(`Membro ${form.name} adicionado!`);
      setForm({ name: '', email: '', password: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao adicionar membro.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id, name, currentStatus) => {
    try {
      await api.patch(`/admin/members/${id}/toggle`);
      toast.success(`${name} foi ${currentStatus ? 'desativado' : 'ativado'}.`);
      fetchData();
    } catch {
      toast.error('Erro ao alterar status.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Excluir permanentemente o membro "${name}"?`)) return;
    try {
      await api.delete(`/admin/members/${id}`);
      toast.success(`${name} removido.`);
      fetchData();
    } catch {
      toast.error('Erro ao remover membro.');
    }
  };

  const handleExport = async () => {
    if (!exportPassword) return toast.error('Confirme sua senha de admin.');
    setExporting(true);
    try {
      // Verifica a senha e baixa um JSON dos dados
      const res = await api.get('/admin/members', {
        headers: { 'x-export-password': exportPassword },
      });
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financeapp-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Backup exportado!');
      setExportPassword('');
    } catch {
      toast.error('Erro ao exportar. Verifique a senha.');
    } finally {
      setExporting(false);
    }
  };

  if (loading || fetching) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--violet)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        {/* Page title */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Painel de Administração</h1>
            <p className={styles.pageSubtitle}>Gerenciamento de membros e dados da aplicação.</p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          {[
            { label: 'Total de membros', value: stats.totalMembers, color: 'violet' },
            { label: 'Membros ativos', value: stats.activeMembers, color: 'green' },
            { label: 'Inativos', value: stats.totalMembers - stats.activeMembers, color: 'red' },
          ].map((s) => (
            <div key={s.label} className={`${styles.statCard} ${styles[s.color]}`}>
              <p className={styles.statValue}>{s.value}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Add member */}
        <section className="card">
          <h2 className={styles.sectionTitle}>Adicionar Novo Membro</h2>
          <form onSubmit={handleAddMember} className={styles.addForm}>
            <input
              className="input"
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input"
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="input"
              type="password"
              placeholder="Senha Temporária"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button className="btn-primary" type="submit" disabled={submitting}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {submitting ? 'Adicionando...' : 'Adicionar'}
            </button>
          </form>
        </section>

        {/* Members list */}
        <section className="card">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Membros Cadastrados</h2>
            <span className={styles.badge}>{members.length}</span>
          </div>

          {members.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <p>Nenhum Membro Cadastrado</p>
              <span>Use o formulário acima para adicionar o primeiro membro da família à plataforma.</span>
            </div>
          ) : (
            <div className={styles.memberList}>
              {members.map((m) => (
                <div key={m._id} className={styles.memberRow}>
                  <div className={styles.memberAvatar}>
                    {m.avatar
                      ? <img src={m.avatar} alt={m.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : <span>{m.name[0].toUpperCase()}</span>
                    }
                  </div>
                  <div className={styles.memberInfo}>
                    <span className={styles.memberName}>{m.name}</span>
                    <span className={styles.memberEmail}>{m.email}</span>
                  </div>
                  <div className={styles.memberMeta}>
                    {m.temporaryPassword && (
                      <span className={styles.tempTag}>Senha temporária</span>
                    )}
                    <span className={`${styles.statusDot} ${m.isActive ? styles.active : styles.inactive}`}>
                      {m.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className={styles.memberActions}>
                    <button
                      className="btn-ghost"
                      style={{ padding: '7px 14px', fontSize: '12px' }}
                      onClick={() => handleToggle(m._id, m.name, m.isActive)}
                    >
                      {m.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(m._id, m.name)}
                      title="Excluir membro"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Backup */}
        <section className="card">
          <h2 className={styles.sectionTitle}>Backup e Restauração</h2>
          <div className={styles.backupRow}>
            <div>
              <p className={styles.backupLabel}>Exportar Dados Criptografados</p>
              <p className={styles.backupDesc}>Gere um arquivo seguro com todos os seus dados.</p>
            </div>
            <div className={styles.backupActions}>
              <input
                className="input"
                type="password"
                placeholder="Confirme sua senha de admin"
                value={exportPassword}
                onChange={(e) => setExportPassword(e.target.value)}
                style={{ minWidth: 260 }}
              />
              <button className="btn-primary" onClick={handleExport} disabled={exporting}>
                {exporting ? 'Exportando...' : 'Exportar'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
