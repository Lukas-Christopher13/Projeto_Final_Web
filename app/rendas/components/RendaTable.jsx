"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const TIPOS = ["Única", "Mensal", "Semanal", "Quinzenal", "Anual"];

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
}

export default function RendaTable({ rendas, atualizar }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  async function deletar(id) {
    if (!confirm("Deseja remover essa renda?")) return;

    try {
      await fetch(`/api/rendas/${id}`, {
        method: "DELETE"
      });
      atualizar();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar a renda");
    }
  }

  function handleEdit(renda) {
    setEditingId(renda._id);
    setEditForm({ ...renda });
  }

  async function handleEditSave(id) {
    try {
      await fetch(`/api/rendas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          descricao: editForm.descricao,
          valor: Number(editForm.valor),
          tipo: editForm.tipo,
          data: editForm.data
        })
      });
      setEditingId(null);
      setEditForm({});
      atualizar();
    } catch (err) {
      console.error("Erro ao editar:", err);
      alert("Erro ao atualizar a renda");
    }
  }

  if (rendas.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="text-center py-8 text-gray-600 text-sm">
          Nenhuma renda encontrada para este período.
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
              Data
            </th>
            <th className="text-left px-4 py-3 text-xs text-gray-600 tracking-wider uppercase font-semibold">
              Tipo
            </th>
            <th className="text-right px-4 py-3 text-xs text-gray-600 tracking-wider uppercase font-semibold">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {rendas.map((renda) => (
            <tr
              key={renda._id}
              className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
            >
              {editingId === renda._id ? (
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
                    <input
                      type="date"
                      value={editForm.data?.split('T')[0] ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, data: e.target.value }))
                      }
                      className="border border-gray-200 rounded px-2 py-1 text-sm bg-white text-gray-900"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={editForm.tipo ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, tipo: e.target.value }))
                      }
                      className="border border-gray-200 rounded px-2 py-1 text-sm bg-white text-gray-900"
                    >
                      {TIPOS.map((t) => (
                        <option key={t} value={t.toLowerCase()}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEditSave(renda._id)}
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
                    {renda.descricao}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 font-medium">
                    {formatCurrency(renda.valor)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatDate(renda.data)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                    {renda.tipo}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(renda)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deletar(renda._id)}
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
