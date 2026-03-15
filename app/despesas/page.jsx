"use client";

import { useEffect, useState, useCallback } from "react";
import DespesaForm from "./components/DespesaForm";
import DespesaTable from "./components/DespesaTable";
import { FileText } from "lucide-react";

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export default function DespesasPage() {
  const [despesas, setDespesas] = useState([]);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());

  const carregarDespesas = useCallback(async () => {
    try {
      const res = await fetch(`/api/despesas?mes=${mes}&ano=${ano}`);
      if (!res.ok) throw new Error("Falha ao buscar");
      const data = await res.json();
      setDespesas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setDespesas([]);
    }
  }, [mes, ano]);

  useEffect(() => {
    carregarDespesas();
  }, [carregarDespesas]);

  function proximoMes() {
    if (mes === 12) {
      setMes(1);
      setAno((prev) => prev + 1);
    } else {
      setMes((prev) => prev + 1);
    }
  }

  function mesAnterior() {
    if (mes === 1) {
      setMes(12);
      setAno((prev) => prev - 1);
    } else {
      setMes((prev) => prev - 1);
    }
  }

  function mesAtual() {
    const hoje = new Date();
    setMes(hoje.getMonth() + 1);
    setAno(hoje.getFullYear());
  }

  function handleExport() {
    const header = "DESCRIÇÃO,VALOR,DATA,CATEGORIA,VÍNCULO\n";
    const rows = despesas
      .map(
        (d) =>
          `"${d.descricao}","R$ ${d.valor.toFixed(2)}","${new Date(d.data).toLocaleDateString('pt-BR')}","${d.categoria}","${d.vinculo}"`
      )
      .join("\n");
    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `despesas-${MESES[mes - 1]}-${ano}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">Gerenciar Despesas</h1>
          <DespesaForm atualizar={carregarDespesas} />

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Despesas de {MESES[mes - 1]} de {ano}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
              >
                <FileText size={15} />
                Exportar
              </button>
              <button
                onClick={mesAtual}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
              >
                Mês Atual
              </button>
              <button
                onClick={mesAnterior}
                className="border border-gray-200 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100 transition-colors text-gray-900"
              >
                Anterior
              </button>
              <button
                onClick={proximoMes}
                className="border border-gray-200 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100 transition-colors text-gray-900"
              >
                Próximo
              </button>
            </div>
          </div>

          <DespesaTable despesas={despesas} atualizar={carregarDespesas} />
        </div>
      </div>
    </div>
  );
}
