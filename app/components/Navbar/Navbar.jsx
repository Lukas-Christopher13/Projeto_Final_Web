"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
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
    <nav className="border-b border-gray-200 bg-white px-6 py-3 flex items-center gap-6">
      <Link href="/">
        <span className="text-blue-600 font-semibold text-base whitespace-nowrap cursor-pointer select-none">
          Meu Gestor Financeiro
        </span>
      </Link>
      <div className="flex items-center gap-5 flex-1">
        {links.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`text-sm font-medium transition-colors px-2 py-1 rounded ${
              pathname === link.path
                ? "text-white bg-indigo-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {link.name}
          </Link>
        ))}
        <Link
          href="/admin"
          className={`text-sm transition-colors ${
            pathname === "/admin"
              ? "text-purple-600 font-medium"
              : "text-purple-500 hover:text-purple-600"
          }`}
        >
          Admin
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title="Alternar modo escuro"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5">
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </nav>
  );
}
