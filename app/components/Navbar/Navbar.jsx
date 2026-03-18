"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setIsAdmin(user.role === "admin");
      setUserName(user.name);
    }
  }, []);

  const links = [
    { name: "Rendas", path: "/rendas" },
    { name: "Despesas", path: "/despesas" },
    { name: "Reservas", path: "/reserva_investimento" },
    { name: "Parcelamentos", path: "/parcelamentos" },
    { name: "Contas", path: "/contas" },
    { name: "Relatórios", path: "/financeiro_anual" },
  ];

  return (
    <nav className={styles.barra}>
      <Link href="/dashboard">
        <span className={styles.logo}>Meu Gestor Financeiro</span>
      </Link>

      <div className={styles.menu}>
        {links.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`${styles.link} ${pathname === link.path ? styles.linkAtivo : ""}`}
          >
            {link.name}
          </Link>
        ))}

        {isAdmin && (
          <Link
            href="/admin"
            className={`${styles.linkAdmin} ${pathname === "/admin" ? styles.linkAdminAtivo : ""}`}
          >
            Admin
          </Link>
        )}
      </div>

      <div className={styles.acoes}>
        {userName && (                                
          <span className={styles.userName}>{userName}</span>
        )}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={styles.botaoTema}
          title="Alternar modo escuro"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          className={styles.botaoSair}
          onClick={() => {
            localStorage.clear();
            document.cookie = "token=; max-age=0; path=/";
            window.dispatchEvent(new Event("auth-change"));
            router.push("/login");
          }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </nav>
  );
}
