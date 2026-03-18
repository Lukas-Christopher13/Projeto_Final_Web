"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  // Salva token em localStorage E em cookie (necessário para o proxy.ts)
  const saveAuth = (token: string, user: any ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginEmail || !loginPassword) {
      setError("Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Credenciais inválidas.");
        return;
      }
      saveAuth(data.token, data.user);
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!regName || !regEmail || !regPassword || !regConfirm) {
      setError("Preencha todos os campos.");
      return;
    }
    if (regPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (regPassword !== regConfirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Erro ao criar conta.");
        return;
      }
      saveAuth(data.token, data.user);
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={{ fontSize: "28px" }}>💰</span>
          <span style={styles.logoText}>FinanceApp</span>
        </div>

        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(tab === "login" ? styles.tabActive : {}),
            }}
            onClick={() => {
              setTab("login");
              setError("");
            }}
          >
            Entrar
          </button>
          <button
            style={{
              ...styles.tab,
              ...(tab === "register" ? styles.tabActive : {}),
            }}
            onClick={() => {
              setTab("register");
              setError("");
            }}
          >
            Criar conta
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {tab === "login" && (
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>E-mail</label>
              <input
                style={styles.input}
                type="email"
                placeholder="seu@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Senha</label>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button style={styles.btnPrimary} type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <p style={styles.switchText}>
              Não tem conta?{" "}
              <button
                type="button"
                style={styles.switchBtn}
                onClick={() => {
                  setTab("register");
                  setError("");
                }}
              >
                Criar conta
              </button>
            </p>
          </form>
        )}

        {tab === "register" && (
          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Nome completo</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Seu nome"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>E-mail</label>
              <input
                style={styles.input}
                type="email"
                placeholder="seu@email.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>
                Senha <span style={styles.hint}>(mín. 6 caracteres)</span>
              </label>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirmar senha</label>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
              />
            </div>
            <button style={styles.btnPrimary} type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
            <p style={styles.switchText}>
              Já tem conta?{" "}
              <button
                type="button"
                style={styles.switchBtn}
                onClick={() => {
                  setTab("login");
                  setError("");
                }}
              >
                Entrar
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f2f8",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
    justifyContent: "center",
  },
  logoText: { fontSize: "22px", fontWeight: 700, color: "#1a1835" },
  tabs: {
    display: "flex",
    background: "#f5f7fc",
    borderRadius: "10px",
    padding: "4px",
    marginBottom: "24px",
    gap: "4px",
  },
  tab: {
    flex: 1,
    padding: "9px",
    background: "none",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#9491b4",
    cursor: "pointer",
  },
  tabActive: { background: "#6c63ff", color: "#fff" },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "16px",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: 600, color: "#4b4870" },
  hint: {
    fontSize: "11px",
    fontWeight: 400,
    color: "#9491b4",
    marginLeft: "4px",
  },
  input: {
    width: "100%",
    background: "#f5f7fc",
    border: "1px solid rgba(108,99,255,0.2)",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "14px",
    color: "#1a1835",
    outline: "none",
    boxSizing: "border-box",
  },
  btnPrimary: {
    background: "#6c63ff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "4px",
  },
  switchText: {
    textAlign: "center",
    fontSize: "13px",
    color: "#9491b4",
    margin: 0,
  },
  switchBtn: {
    background: "none",
    border: "none",
    color: "#6c63ff",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
  },
};
