"use client";

import { useEffect, useState } from "react";
import CartaoForm from "./components/CartaoForm";
import CartaoList from "./components/CartaoList";
import styles from "./page.module.css";
import useRequireAuth from "@/app/components/Auth/useRequireAuth";

export default function ContasPage() {
  useRequireAuth();
  const [cartoes, setCartoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function carregarCartoes() {
    try {
      setLoading(true);
      const response = await fetch("/api/cartoes");
      if (!response.ok) throw new Error("Erro ao buscar cartões");

      const data = await response.json();
      setCartoes(data);
      setError("");
    } catch (err) {
      setError(err.message);
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCartoes();
  }, []);

  return (
    <div className={styles.pagina}>
      <div className={styles.conteudo}>
        <div className={styles.container}>
          <h1 className={styles.titulo}>Gerenciar Contas</h1>

        {error && (
          <div className={styles.erroMensagem}>
            {error}
          </div>
        )}

        <div className={styles.layout}>
          <div>
            <CartaoForm onSuccess={carregarCartoes} />
          </div>

          <div>
            {loading ? (
              <div className={styles.carregando}>
                Carregando cartões...
              </div>
            ) : (
              <CartaoList cartoes={cartoes} atualizar={carregarCartoes} />
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
