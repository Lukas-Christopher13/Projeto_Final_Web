"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AuthCard from "./components/AuthCard";
import Logo from "./components/Logo";
import AuthTabs from "./components/AuthTabs";
import ErrorBanner from "./components/ErrorBanner";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  // Salva token em localStorage E em cookie (necessário para o proxy.ts)
  const saveAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    window.dispatchEvent(new Event("auth-change"));
  };

  const handleLogin = async (e) => {
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

  const handleRegister = async (e) => {
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
    <div className={styles.page}>
      <AuthCard>
        <Logo />
        <AuthTabs
          activeTab={tab}
          onChange={(nextTab) => {
            setTab(nextTab);
            setError("");
          }}
        />
        <ErrorBanner message={error} />
        {tab === "login" ? (
          <LoginForm
            loading={loading}
            email={loginEmail}
            password={loginPassword}
            onEmailChange={setLoginEmail}
            onPasswordChange={setLoginPassword}
            onSubmit={handleLogin}
            onSwitch={() => {
              setTab("register");
              setError("");
            }}
          />
        ) : (
          <RegisterForm
            loading={loading}
            name={regName}
            email={regEmail}
            password={regPassword}
            confirm={regConfirm}
            onNameChange={setRegName}
            onEmailChange={setRegEmail}
            onPasswordChange={setRegPassword}
            onConfirmChange={setRegConfirm}
            onSubmit={handleRegister}
            onSwitch={() => {
              setTab("login");
              setError("");
            }}
          />
        )}
      </AuthCard>
    </div>
  );
}
