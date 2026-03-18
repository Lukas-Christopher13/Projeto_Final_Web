"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

  const tokenRef = useRef(null);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenRef.current}`,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (!savedToken || !savedUser) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(savedUser);
    if (u.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    tokenRef.current = savedToken;
    setUser(u);
  }, []);

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const [membersRes, statsRes] = await Promise.all([
        fetch("/api/admin/members", { headers: getHeaders() }),
        fetch("/api/admin/stats", { headers: getHeaders() }),
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
  }, []);

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
        headers: getHeaders(),
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
    try {
      const res = await fetch(`/api/admin/members/${id}/toggle`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (res.ok) {
        // Atualiza o estado local imediatamente, sem esperar o fetchData
        setMembers((prev) =>
          prev.map((m) => (m._id === id ? { ...m, isActive: !m.isActive } : m)),
        );
        setStats((prev) => {
          const member = members.find((m) => m._id === id);
          if (!member) return prev;
          const delta = member.isActive ? -1 : 1;
          return {
            ...prev,
            activeMembers: prev.activeMembers + delta,
            inactiveMembers: prev.inactiveMembers - delta,
          };
        });
      } else {
        setMsg("Erro ao alterar status do membro.");
      }
    } catch {
      setMsg("Erro ao conectar.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        // Remove o membro do estado local imediatamente
        setMembers((prev) => prev.filter((m) => m._id !== id));
        setStats((prev) => {
          const member = members.find((m) => m._id === id);
          const wasActive = member?.isActive;
          return {
            ...prev,
            totalMembers: prev.totalMembers - 1,
            activeMembers: wasActive
              ? prev.activeMembers - 1
              : prev.activeMembers,
            inactiveMembers: wasActive
              ? prev.inactiveMembers
              : prev.inactiveMembers - 1,
          };
        });
      } else {
        setMsg("Erro ao remover membro.");
      }
    } catch {
      setMsg("Erro ao conectar.");
    }
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
