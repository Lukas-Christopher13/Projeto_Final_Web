"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

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

const VINCULOS = [
  { label: "Conta Corrente", value: "conta_corrente" },
  { label: "Cartão de Crédito", value: "cartao_credito" }
];

function getCategoryColor(categoria) {
  const cores = {
    "Contas da Casa": "bg-yellow-400 text-gray-900",
    "Alimentação": "bg-green-400 text-gray-900",
    "Transporte": "bg-blue-400 text-white",
    "Saúde": "bg-red-400 text-white",
    "Educação": "bg-purple-400 text-white",
    "Lazer": "bg-pink-400 text-white",
    "Compras": "bg-orange-400 text-white",
    "Outros": "bg-gray-400 text-white"
  };
  return cores[categoria] || "bg-gray-300 text-gray-900";
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
}

export default function DespesaTable({ despesas, atualizar }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  async function deletar(id, parcelaId) {
    if (!confirm("Deseja remover essa despesa? Se é parcelada, remova desta linha. Para todas as parcelas, clique novamente.")) return;

    try {
      await fetch(`/api/despesas/${id}`, {
        method: "DELETE"
      });
      atualizar();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar a despesa");
    }
  }

  function handleEdit(despesa) {
    setEditingId(despesa._id);
    setEditForm({ ...despesa });
  }

  async function handleEditSave(id) {
    try {
      await fetch(`/api/despesas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          descricao: editForm.descricao,
          valor: Number(editForm.valor),
          categoria: editForm.categoria,
          vinculo: editForm.vinculo,
          data: editForm.data
        })
      });
      setEditingId(null);
      setEditForm({});
      atualizar();
    } catch (err) {
      console.error("Erro ao editar:", err);
      alert("Erro ao atualizar a despesa");
    }
  }

  if (despesas.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="text-center py-8 text-gray-600 text-sm">
          Nenhuma despesa encontrada para este período.
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-4 py-3 text-xs text-gray-600 tracking-wider uppercase font-semibold">
              Descrição
            </th>
            <th className="text-left px-4 py-3 text-xs text-gray-600 tracking-wider uppercase font-semibold">
              Valor
            </th>
            <th className="text-left px-4 py-3 text-xs text-gray-600 tracking-wider uppercase font-semibold">
              Categoria
            </th>
            <th className="text-left px-4 py-3 text-xs text-gray-600 tracking-wider uppercase font-semibold">
              Conta
            </th>
            <th className="text-left px-4 py-3 text-xs text-gray-600 tracking-wider uppercase font-semibold">
              Data Venc.
            </th>
            <th className="text-right px-4 py-3 text-xs text-gray-600 tracking-wider uppercase font-semibold">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {despesas.map((despesa) => (
            <tr
              key={despesa._id}
              className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
            >
              {editingId === despesa._id ? (
                <>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editForm.descricao ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, descricao: e.target.value }))
                      }
                      className="border border-gray-200 rounded px-2 py-1 text-sm bg-white text-gray-900 w-full"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.valor ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, valor: e.target.value }))
                      }
                      className="border border-gray-200 rounded px-2 py-1 text-sm bg-white text-gray-900 w-full"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={editForm.categoria ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, categoria: e.target.value }))
                      }
                      className="border border-gray-200 rounded px-2 py-1 text-sm bg-white text-gray-900"
                    >
                      {CATEGORIAS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={editForm.vinculo ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, vinculo: e.target.value }))
                      }
                      className="border border-gray-200 rounded px-2 py-1 text-sm bg-white text-gray-900"
                    >
                      {VINCULOS.map((v) => (
                        <option key={v.value} value={v.value}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={editForm.data?.split('T')[0] ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, data: e.target.value }))
                      }
                      className="border border-gray-200 rounded px-2 py-1 text-sm bg-white text-gray-900"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEditSave(despesa._id)}
                      className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded mr-1 transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs border border-gray-200 hover:bg-gray-100 px-2 py-1 rounded transition-colors text-gray-900"
                    >
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {despesa.descricao}
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600 font-medium">
                    {formatCurrency(despesa.valor)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(despesa.categoria)}`}>
                      {despesa.categoria.substring(0, 3)}...
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {despesa.vinculo === "conta_corrente" ? "Conta Corrente" : "Cartão Crédito"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatDate(despesa.data)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(despesa)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deletar(despesa._id, despesa.parcelaId)}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
