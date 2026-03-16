"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import DebtSummaryCard from "./components/DebtSummaryCard";
import PaymentSchedule from "./components/PaymentSchedule";
import CartaoDetails from "./components/CartaoDetails";

export default function ParcelamentosPage() {
  const [data, setData] = useState({
    totalDividas: 0,
    resumoMensal: {},
    detalhesCartao: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/parcelamentos");
        if (!response.ok) throw new Error("Erro ao buscar dados");

        const resultado = await response.json();
        setData(resultado);
        setError("");
      } catch (err) {
        setError(err.message);
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  return (
    <div className={styles.pagina}>
      <div className={styles.conteudo}>
        <div className={styles.container}>
          <div className={styles.cabecalho}>
            <h1 className={styles.titulo}>
              Visão de Dívidas Futuras
            </h1>
            <p className={styles.descricao}>
              Valores parcelados a vencer nos próximos meses.
            </p>
          </div>

          {error && (
            <div className={styles.erroMensagem}>
              {error}
            </div>
          )}

          {loading ? (
            <div className={styles.carregando}>
              Carregando dados...
            </div>
          ) : (
            <div className={styles.tabela}>
              {/* Card de Dívida Total */}
              <DebtSummaryCard totalDividas={data.totalDividas} />

              {/* Resumo Mensal */}
              <PaymentSchedule resumoMensal={data.resumoMensal} />

              {/* Detalhes por Cartão */}
              <CartaoDetails detalhesCartao={data.detalhesCartao} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
