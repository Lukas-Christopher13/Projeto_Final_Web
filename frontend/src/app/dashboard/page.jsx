'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import styles from './dashboard.module.css';

const CATEGORIES = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Aluguel', 'Outros'],
  expense: ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros'],
};

const formatCurrency = (val) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    description: '', amount: '', type: 'expense', category: 'Alimentação', date: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const now = new Date();
  const [month] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const fetchData = useCallback(async () => {
    try {
      const [summaryRes, txRes] = await Promise.all([
        api.get(`/transactions/summary?month=${month}&year=${year}`),
        api.get(`/transactions?limit=30`),
      ]);
      setSummary(summaryRes.data.summary);
      setTransactions(txRes.data.transactions);
    } catch {
      toast.error('Erro ao carregar dados.');
    } finally {
      setFetching(false);
    }
  }, [month, year]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return toast.error('Preencha todos os campos.');
    setSubmitting(true);
    try {
      await api.post('/transactions', { ...form, amount: parseFloat(form.amount) });
      toast.success('Transação adicionada!');
      setForm({ description: '', amount: '', type: 'expense', category: 'Alimentação', date: '', notes: '' });
      setShowForm(false);
      fetchData();
    } catch {
      toast.error('Erro ao adicionar transação.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover esta transação?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Removida.');
      fetchData();
    } catch {
      toast.error('Erro ao remover.');
    }
  };

  if (loading || fetching) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--violet)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  const balancePositive = summary.balance >= 0;

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>
              Olá, <em>{user?.name?.split(' ')[0]}</em> 👋
            </h1>
            <p className={styles.pageSubtitle}>
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', day: 'numeric' })}
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova Transação
          </button>
        </div>

        {/* Summary cards */}
        <div className={styles.summaryGrid}>
          <div className={`${styles.summaryCard} ${styles.incomeCard}`}>
            <div className={styles.cardIcon}>↑</div>
            <div>
              <p className={styles.cardLabel}>Receitas do mês</p>
              <p className={styles.cardValue}>{formatCurrency(summary.income)}</p>
            </div>
          </div>
          <div className={`${styles.summaryCard} ${styles.expenseCard}`}>
            <div className={styles.cardIcon}>↓</div>
            <div>
              <p className={styles.cardLabel}>Despesas do mês</p>
              <p className={styles.cardValue}>{formatCurrency(summary.expense)}</p>
            </div>
          </div>
          <div className={`${styles.summaryCard} ${balancePositive ? styles.balancePos : styles.balanceNeg}`}>
            <div className={styles.cardIcon}>{balancePositive ? '◎' : '!'}</div>
            <div>
              <p className={styles.cardLabel}>Saldo atual</p>
              <p className={styles.cardValue}>{formatCurrency(summary.balance)}</p>
            </div>
          </div>
        </div>

        {/* Add transaction form */}
        {showForm && (
          <div className={`card ${styles.formCard}`}>
            <h3 className={styles.formTitle}>Nova Transação</h3>
            <form onSubmit={handleSubmit} className={styles.txForm}>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Tipo</label>
                  <select
                    className="input"
                    value={form.type}
                    onChange={(e) => {
                      const t = e.target.value;
                      setForm({ ...form, type: t, category: CATEGORIES[t][0] });
                    }}
                  >
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                  </select>
                </div>
                <div className={styles.formField}>
                  <label>Categoria</label>
                  <select
                    className="input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES[form.type].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={`${styles.formField} ${styles.grow}`}>
                  <label>Descrição</label>
                  <input className="input" placeholder="Ex: Supermercado Extra" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className={styles.formField}>
                  <label>Valor (R$)</label>
                  <input className="input" type="number" placeholder="0,00" min="0.01" step="0.01"
                    value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div className={styles.formField}>
                  <label>Data</label>
                  <input className="input" type="date" value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar Transação'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transactions list */}
        <div className="card">
          <div className={styles.listHeader}>
            <h3>Transações Recentes</h3>
            <span className={styles.badge}>{transactions.length}</span>
          </div>

          {transactions.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📊</div>
              <p>Nenhuma transação ainda.</p>
              <span>Clique em "Nova Transação" para começar.</span>
            </div>
          ) : (
            <div className={styles.txList}>
              {transactions.map((tx) => (
                <div key={tx._id} className={styles.txItem}>
                  <div className={`${styles.txDot} ${tx.type === 'income' ? styles.incomeDot : styles.expenseDot}`} />
                  <div className={styles.txInfo}>
                    <span className={styles.txDesc}>{tx.description}</span>
                    <span className={styles.txMeta}>{tx.category} · {formatDate(tx.date)}</span>
                  </div>
                  <span className={`${styles.txAmount} ${tx.type === 'income' ? styles.incomeText : styles.expenseText}`}>
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </span>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(tx._id)} title="Remover">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
