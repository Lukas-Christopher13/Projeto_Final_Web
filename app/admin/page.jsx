"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AdminHeader from "./components/AdminHeader";
import MessageBanner from "./components/MessageBanner";
import AdminStats from "./components/AdminStats";
import AddMemberForm from "./components/AddMemberForm";
import MembersList from "./components/MembersList";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
  });
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

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
    const u = JSON.parse(savedUser);
    if (u.role !== "admin") {
      router.push("/dashboard");
      return;
    }
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
    } catch {
      setMsg("Erro ao carregar dados.");
    } finally {
      setFetching(false);
    }
  }, [token]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setMsg("Preencha todos os campos.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ name: "", email: "", password: "" });
        setMsg("");
        fetchData();
      } else setMsg(data.message || "Erro ao adicionar membro.");
    } catch {
      setMsg("Erro ao conectar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    await fetch(`/api/admin/members/${id}/toggle`, { method: "PATCH", headers });
    fetchData();
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Excluir permanentemente "${name}"?`)) return;
    await fetch(`/api/admin/members/${id}`, { method: "DELETE", headers });
    fetchData();
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <AdminHeader />
        <MessageBanner message={msg} />
        <AdminStats stats={stats} />
        <AddMemberForm
          form={form}
          submitting={submitting}
          onChange={setForm}
          onSubmit={handleAdd}
        />
        <MembersList
          members={members}
          fetching={fetching}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
