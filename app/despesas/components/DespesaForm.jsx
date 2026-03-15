"use client";

import { useState, useEffect } from "react";

export default function DespesaForm({ atualizar }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("Contas da Casa");
  const [numeroParcelas, setNumeroParcelas] = useState("1");
  const [vinculo, setVinculo] = useState("conta_corrente");
  const [cartoes, setCartoes] = useState([]);
  const [cartaoId, setCartaoId] = useState("");

  const CATEGORIAS = [
    "Contas da Casa",
    "Alimentação",
    "Transporte",
    "Saúde",
    "Educação",
    "Lazer",
    "Compras",
    "Outros"
  ];

  useEffect(() => {
    const carregarCartoes = async () => {
      try {
        const response = await fetch("/api/cartoes");
        if (response.ok) {
          const data = await response.json();
          setCartoes(data);
        }
      } catch (error) {
        console.error("Erro ao carregar cartões:", error);
      }
    };

    carregarCartoes();
  }, []);

  async function adicionarDespesa(e) {
    e.preventDefault();

    if (!descricao.trim() || !valor || !data || !categoria) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      await fetch("/api/despesas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descricao,
          valor: Number(valor),
          data,
          categoria,
          numeroParcelas: parseInt(numeroParcelas),
          vinculo,
          cartao: cartaoId || null
        })
      });

      setDescricao("");
      setValor("");
      setData("");
      setCategoria("Contas da Casa");
      setNumeroParcelas("1");
      setVinculo("conta_corrente");
      setCartaoId("");

      atualizar();
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      alert("Erro ao adicionar despesa");
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-white">

      <h2 className="mb-5 text-xl font-bold text-gray-900">
        Adicionar Nova Despesa
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4" onSubmit={adicionarDespesa}>

        <div className="flex flex-col gap-1">
          <label htmlFor="descricao" className="text-sm font-bold text-gray-900">Descrição</label>
          <input
            id="descricao"
            type="text"
            placeholder="Ex: Conta de luz"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="valor" className="text-sm font-bold text-gray-900">Valor Total (R$)</label>
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
          <label htmlFor="data" className="text-sm font-bold text-gray-900">Data da Compra / 1º Vencimento</label>
          <input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="categoria" className="text-sm font-bold text-gray-900">Categoria</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="parcelas" className="text-sm font-bold text-gray-900">Nº de Parcelas</label>
          <input
            id="parcelas"
            type="number"
            min="1"
            max="48"
            value={numeroParcelas}
            onChange={(e) => setNumeroParcelas(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="vinculo" className="text-sm font-bold text-gray-900">Conta / Cartão (Opcional)</label>
          <select
            id="vinculo"
            value={cartaoId}
            onChange={(e) => {
              setCartaoId(e.target.value);
              if (e.target.value) {
                const cartao = cartoes.find(c => c._id === e.target.value);
                if (cartao) {
                  setVinculo(cartao.tipo === "credito" ? "conta_corrente" : "cartao_credito");
                }
              }
            }}
            className="border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Nenhum (Padrão)</option>
            {cartoes.map((cartao) => (
              <option key={cartao._id} value={cartao._id}>
                {cartao.nome} - {cartao.tipo === "credito" ? "Crédito" : "Débito"} (•{cartao.ultimos4Digitos})
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-1 md:col-span-3 flex justify-end mt-2">
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md text-sm transition-colors"
          >
            Adicionar Despesa
          </button>
        </div>

      </form>

    </div>
  );
}
