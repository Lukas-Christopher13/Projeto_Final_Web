"use client";

import { useState } from "react";

export default function CartaoForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "credito",
    titular: "",
    ultimos4Digitos: "",
    cor: "#7C3AED"
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/cartoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar cartão");
      }

      setFormData({
        nome: "",
        tipo: "credito",
        titular: "",
        ultimos4Digitos: "",
        cor: "#7C3AED"
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Erro ao criar cartão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Adicionar Conta/Cartão</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Nome da Conta/Cartão
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) =>
                setFormData((f) => ({ ...f, nome: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Nubank, MerPago"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Tipo
            </label>
            <select
              value={formData.tipo}
              onChange={(e) =>
                setFormData((f) => ({ ...f, tipo: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="credito">Cartão de Crédito</option>
              <option value="debito">Cartão de Débito</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Nome do Titular
            </label>
            <input
              type="text"
              required
              value={formData.titular}
              onChange={(e) =>
                setFormData((f) => ({ ...f, titular: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Últimos 4 dígitos
            </label>
            <input
              type="text"
              required
              maxLength="4"
              pattern="[0-9]{4}"
              value={formData.ultimos4Digitos}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  ultimos4Digitos: e.target.value.replace(/[^0-9]/g, "")
                }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: 9999"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Cor do Cartão
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.cor}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, cor: e.target.value }))
                }
                className="w-20 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <div
                className="w-32 h-10 rounded border border-gray-300"
                style={{ backgroundColor: formData.cor }}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded transition-colors"
        >
          {loading ? "Adicionando..." : "Adicionar"}
        </button>
      </form>
    </div>
  );
}
