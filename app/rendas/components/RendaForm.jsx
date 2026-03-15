"use client";

import { useState } from "react";

export default function RendaForm({ atualizar }) {

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("unica");
  const [data, setData] = useState("");

  const TIPOS = ["Única", "Mensal", "Semanal", "Quinzenal", "Anual"];

  async function adicionarRenda(e) {
    e.preventDefault();

    await fetch("/api/rendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descricao,
        valor: Number(valor),
        tipo,
        data
      })
    });

    setDescricao("");
    setValor("");
    setData("");

    atualizar();
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-white">

      <h2 className="mb-5 text-xl font-bold text-gray-900">
        Adicionar Nova Renda
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" onSubmit={adicionarRenda}>

        <div className="flex flex-col gap-1">
          <label htmlFor="descricao" className="text-sm font-bold text-gray-900">Descrição</label>
          <input
            id="descricao"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="valor" className="text-sm font-bold text-gray-900">Valor (R$)</label>
          <input
            id="valor"
            type="number"
            min="0"
            step="0.01"
            placeholder="R$ 0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="tipo" className="text-sm font-bold text-gray-900">Tipo</label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-auto"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t.toLowerCase()}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="data" className="text-sm font-bold text-gray-900">Data</label>
          <input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-end mt-2">
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md text-sm transition-colors"
          >
            Adicionar Renda
          </button>
        </div>

      </form>

    </div>
  );
}
