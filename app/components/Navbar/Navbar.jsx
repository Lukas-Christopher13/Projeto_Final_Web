"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const links = [
    { name: "Rendas", path: "/rendas" },
    { name: "Despesas", path: "/despesas" },
    { name: "Reservas", path: "/reserva_investimento" },
    { name: "Parcelamentos", path: "/parcelamentos" },
    { name: "Contas", path: "/contas" },
    { name: "Relatórios", path: "/financeiro_anual" }
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className={styles.barra}>
      <Link href="/dashboard">
        <span className={styles.logo}>
          Meu Gestor Financeiro
        </span>
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
        <Link
          href="/admin"
          className={`${styles.linkAdmin} ${pathname === "/admin" ? styles.linkAdminAtivo : ""}`}
        >
          Admin
        </Link>
      </div>
      <div className={styles.acoes}>
        <button
          onClick={toggleDarkMode}
          className={styles.botaoTema}
          title="Alternar modo escuro"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className={styles.botaoSair} onClick={() => { localStorage.clear(); router.push("/login")}}>
          <LogOut size={16}  />
          Sair
        </button>
      </div>
    </nav>
  );
}
