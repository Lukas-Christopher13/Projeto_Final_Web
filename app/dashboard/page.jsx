"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import DashboardHeader from "./components/DashboardHeader";
import MonthNavigator from "./components/MonthNavigator";
import SummaryCards from "./components/SummaryCards";
import MessageBanner from "./components/MessageBanner";
import NewTransactionForm from "./components/NewTransactionForm";
import ChartsSection from "./components/ChartsSection";
import TopExpenses from "./components/TopExpenses";
import TransactionsList from "./components/TransactionsList";

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

const fmt = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    v || 0,
  );
const fmtShort = (v) =>
  v >= 1000 ? `R$${(v / 1000).toFixed(1)}k` : `R$${v.toFixed(0)}`;
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    expensesByCategory: [],
    topExpenses: [],
  });
  const [transactions, setTransactions] = useState([]);
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

  const handleSubmit = async (e) => {
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

  const handleDelete = async (id) => {
    if (!confirm("Remover esta transação?")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE", headers });
    fetchData();
  };

  const barData = [
    { name: "Receitas", valor: summary.income, fill: "#34d399" },
    { name: "Despesas", valor: summary.expense, fill: "#f87171" },
  ];
  const pieData = (summary.expensesByCategory || []).map((c) => ({
    name: c._id,
    value: c.total,
  }));

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <DashboardHeader
          userName={user?.name?.split(" ")[0]}
          onToggleForm={() => setShowForm(!showForm)}
        />

        <MessageBanner message={msg} />

        <MonthNavigator
          monthLabel={MONTHS[month - 1]}
          year={year}
          isCurrentMonth={isCurrentMonth}
          onPrev={prevMonth}
          onNext={nextMonth}
          onCurrent={() => {
            setMonth(now.getMonth() + 1);
            setYear(now.getFullYear());
          }}
        />

        <SummaryCards summary={summary} formatCurrency={fmt} />

        {showForm && (
          <NewTransactionForm
            form={form}
            categories={CATEGORIES}
            submitting={submitting}
            onChange={setForm}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}

        {!fetching && (
          <ChartsSection
            pieData={pieData}
            barData={barData}
            colors={PIE_COLORS}
            monthLabel={MONTHS[month - 1]}
            formatCurrency={fmt}
            formatShort={fmtShort}
          />
        )}

        {!fetching && (
          <TopExpenses
            expenses={summary.topExpenses || []}
            totalExpense={summary.expense}
            colors={PIE_COLORS}
            monthLabel={MONTHS[month - 1]}
            formatCurrency={fmt}
            formatDate={fmtDate}
          />
        )}

        <TransactionsList
          transactions={transactions}
          monthLabel={MONTHS[month - 1]}
          year={year}
          fetching={fetching}
          formatCurrency={fmt}
          formatDate={fmtDate}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
