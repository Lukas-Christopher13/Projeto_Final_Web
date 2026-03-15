"use client";

import { useEffect, useState } from "react";
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
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Visão de Dívidas Futuras
          </h1>
          <p className="text-gray-600 text-sm">
            Valores parcelados a vencer nos próximos meses.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
            Carregando dados...
          </div>
        ) : (
          <div className="space-y-6">
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
