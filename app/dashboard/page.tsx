"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const CATEGORIES = {
  income: ["Salário", "Freelance", "Investimentos", "Aluguel", "Outros"],
  expense: [
    "Alimentação",
    "Moradia",
    "Transporte",
    "Saúde",
    "Educação",
    "Lazer",
    "Outros",
  ],
};
const PIE_COLORS = [
  "#6c63ff",
  "#f5c842",
  "#34d399",
  "#f87171",
  "#60a5fa",
  "#fb923c",
  "#a78bfa",
];

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    v || 0,
  );
const fmtShort = (v: number) =>
  v >= 1000 ? `R$${(v / 1000).toFixed(1)}k` : `R$${v.toFixed(0)}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState<any>({
    income: 0,
    expense: 0,
    balance: 0,
    expensesByCategory: [],
    topExpenses: [],
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "Alimentação",
    date: "",
    notes: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!token || !savedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(savedUser));
  }, []);

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const [sumRes, txRes] = await Promise.all([
        fetch(`/api/transactions/summary?month=${month}&year=${year}`, {
          headers,
        }),
        fetch(`/api/transactions?limit=50`, { headers }),
      ]);
      const sumData = await sumRes.json();
      const txData = await txRes.json();
      if (sumData.success) setSummary(sumData.summary);
      if (txData.success) setTransactions(txData.transactions);
    } catch {
      setMsg("Erro ao carregar dados.");
    } finally {
      setFetching(false);
    }
  }, [month, year, token]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };
  const isCurrentMonth =
    month === now.getMonth() + 1 && year === now.getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) {
      setMsg("Preencha todos os campos.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers,
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      });
      if (res.ok) {
        setForm({
          description: "",
          amount: "",
          type: "expense",
          category: "Alimentação",
          date: "",
          notes: "",
        });
        setShowForm(false);
        fetchData();
      } else setMsg("Erro ao adicionar transação.");
    } catch {
      setMsg("Erro ao conectar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover esta transação?")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE", headers });
    fetchData();
  };

  const barData = [
    { name: "Receitas", valor: summary.income, fill: "#34d399" },
    { name: "Despesas", valor: summary.expense, fill: "#f87171" },
  ];
  const pieData = (summary.expensesByCategory || []).map((c: any) => ({
    name: c._id,
    value: c.total,
  }));
  const balPos = summary.balance >= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Navbar ── */}
      
      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">
        {/* ── Page header ── */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Olá,{" "}
              <em className="italic text-indigo-600 not-italic">
                {user?.name?.split(" ")[0]}
              </em>{" "}
              👋
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Visão financeira mensal
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
            onClick={() => setShowForm(!showForm)}
          >
            + Nova Transação
          </button>
        </div>

        {msg && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
            {msg}
          </div>
        )}

        {/* ── Navegação mensal ── */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-xl text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            ‹
          </button>
          <div className="min-w-44 text-center">
            <span className="text-xl font-bold text-gray-900">
              {MONTHS[month - 1]}
            </span>
            <span className="text-sm text-gray-400 ml-2">{year}</span>
          </div>
          <button
            onClick={nextMonth}
            className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-xl text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            ›
          </button>
          {!isCurrentMonth && (
            <button
              onClick={() => {
                setMonth(now.getMonth() + 1);
                setYear(now.getFullYear());
              }}
              className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Mês atual
            </button>
          )}
        </div>

        {/* ── Cards resumo ── */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-emerald-400">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
              Total de Entradas
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {fmt(summary.income)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-400">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
              Total de Saídas
            </p>
            <p className="text-2xl font-bold text-red-500">
              {fmt(summary.expense)}
            </p>
          </div>
          <div
            className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${balPos ? "border-indigo-500" : "border-amber-400"}`}
          >
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
              Saldo Líquido
            </p>
            <p
              className={`text-2xl font-bold ${balPos ? "text-indigo-600" : "text-amber-600"}`}
            >
              {fmt(summary.balance)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {balPos ? "Saldo positivo ✓" : "Saldo negativo !"}
            </p>
          </div>
        </div>

        {/* ── Formulário nova transação ── */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Nova Transação
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-3 flex-wrap">
                <div className="flex flex-col gap-1.5 min-w-32">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Tipo
                  </label>
                  <select
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400"
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value,
                        category: (CATEGORIES as any)[e.target.value][0],
                      })
                    }
                  >
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 min-w-32">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Categoria
                  </label>
                  <select
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {(CATEGORIES as any)[form.type].map((c: string) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-w-40">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Descrição
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400"
                    placeholder="Ex: Supermercado"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5 min-w-28">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Valor (R$)
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400"
                    type="number"
                    placeholder="0,00"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5 min-w-32">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Data
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-gray-200 text-gray-600 text-sm px-5 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                >
                  {submitting ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Gráficos ── */}
        {!fetching && (
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">
                🍕 Despesas por Categoria
              </h3>
              {pieData.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-16">
                  Nenhuma despesa em {MONTHS[month - 1]}
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_: any, i: number) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: any) => fmt(v)}
                      contentStyle={{
                        background: "#fff",
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                    <Legend
                      formatter={(v) => (
                        <span style={{ fontSize: 12, color: "#6b7280" }}>
                          {v}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">
                📊 Receitas vs Despesas
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barSize={56}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280", fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={fmtShort}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v: any) => fmt(v)}
                    contentStyle={{
                      background: "#fff",
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Ranking top 5 ── */}
        {!fetching && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-5">
              🏆 Ranking — 5 Maiores Despesas
            </h3>
            {(summary.topExpenses || []).length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">
                Nenhuma despesa em {MONTHS[month - 1]}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {summary.topExpenses.map((tx: any, i: number) => {
                  const pct =
                    summary.expense > 0
                      ? (tx.amount / summary.expense) * 100
                      : 0;
                  return (
                    <div
                      key={tx._id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${i === 0 ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-400"}`}
                      >
                        {i + 1}º
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {tx.description}
                          </span>
                          <span className="text-sm font-bold text-red-500 whitespace-nowrap ml-2">
                            {fmt(tx.amount)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">
                          {tx.category} · {fmtDate(tx.date)} · {pct.toFixed(1)}%
                          do total
                        </p>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: PIE_COLORS[i % PIE_COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Lista de transações ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-sm font-bold text-gray-900">
              Transações — {MONTHS[month - 1]} {year}
            </h3>
            <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-0.5 rounded-full">
              {transactions.length}
            </span>
          </div>

          {fetching ? (
            <p className="text-center text-gray-400 text-sm py-8">
              Carregando...
            </p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              Nenhuma transação em {MONTHS[month - 1]} {year}
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-gray-50">
              {transactions.map((tx: any) => (
                <div
                  key={tx._id}
                  className="flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${tx.type === "income" ? "bg-emerald-400" : "bg-red-400"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-gray-800 truncate">
                      {tx.description}
                    </span>
                    <span className="text-xs text-gray-400">
                      {tx.category} · {fmtDate(tx.date)}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold whitespace-nowrap ${tx.type === "income" ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {tx.type === "income" ? "+" : "−"} {fmt(tx.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(tx._id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all text-sm p-1"
                  >
                    🗑
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
