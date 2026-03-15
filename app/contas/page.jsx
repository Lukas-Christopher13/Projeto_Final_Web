"use client";

import { useEffect, useState } from "react";
import CartaoForm from "./components/CartaoForm";
import CartaoList from "./components/CartaoList";

export default function ContasPage() {
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
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Gerenciar Contas</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CartaoForm onSuccess={carregarCartoes} />
          </div>

          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
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
