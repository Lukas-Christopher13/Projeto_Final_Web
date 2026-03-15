"use client";

import { useState } from "react";
import { Pencil, Trash2, FileText } from "lucide-react";

export default function CartaoList({ cartoes, atualizar }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  function exportarCartoes() {
    // Headers do CSV
    const headers = ["NOME", "TIPO", "TITULAR", "ÚLTIMOS 4 DÍGITOS"];
    
    // Dados
    const rows = cartoes.map(c => [
      c.nome,
      c.tipo === "credito" ? "Cartão de Crédito" : "Cartão de Débito",
      c.titular,
      c.ultimos4Digitos
    ]);

    // Montar CSV
    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `contas_${new Date().toLocaleDateString("pt-BR")}.csv`;
    link.click();
  }

  async function deletar(id) {
    if (!confirm("Deseja remover este cartão?")) return;

    try {
      const response = await fetch(`/api/cartoes/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Erro ao deletar");
      atualizar();
    } catch (err) {
      alert("Erro ao deletar cartão: " + err.message);
    }
  }

  function handleEdit(cartao) {
    setEditingId(cartao._id);
    setEditForm({ ...cartao });
  }

  async function handleEditSave(id) {
    try {
      const response = await fetch(`/api/cartoes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: editForm.nome,
          tipo: editForm.tipo,
          titular: editForm.titular,
          ultimos4Digitos: editForm.ultimos4Digitos,
          cor: editForm.cor
        })
      });

      if (!response.ok) throw new Error("Erro ao atualizar");
      setEditingId(null);
      setEditForm({});
      atualizar();
    } catch (err) {
      alert("Erro ao atualizar: " + err.message);
    }
  }

  if (cartoes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        Nenhum cartão cadastrado. Adicione um novo!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Contas Cadastradas</h2>
        <button 
          onClick={exportarCartoes}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <FileText size={16} />
          Exportar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cartoes.map((cartao) => (
          <div key={cartao._id} className="relative overflow-hidden rounded-lg border border-gray-200">
            {editingId === cartao._id ? (
              <div className="p-4 bg-gray-50 space-y-3">
                <input
                  type="text"
                  value={editForm.nome || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, nome: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900"
                  placeholder="Nome"
                />
                <select
                  value={editForm.tipo || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, tipo: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900"
                >
                  <option value="credito">Cartão de Crédito</option>
                  <option value="debito">Cartão de Débito</option>
                </select>
                <input
                  type="text"
                  value={editForm.titular || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, titular: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900"
                  placeholder="Titular"
                />
                <input
                  type="text"
                  maxLength="4"
                  value={editForm.ultimos4Digitos || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      ultimos4Digitos: e.target.value.replace(/[^0-9]/g, "")
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900"
                  placeholder="Últimos 4"
                />
                <input
                  type="color"
                  value={editForm.cor || "#6B7280"}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, cor: e.target.value }))
                  }
                  className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEditSave(cartao._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm font-semibold transition-colors"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 border border-gray-300 hover:bg-gray-100 px-2 py-1 rounded text-sm font-semibold text-gray-900 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="p-4 text-white"
                  style={{ backgroundColor: cartao.cor || "#6B7280" }}
                >
                  <div className="text-sm opacity-75 mb-1">
                    Final • {cartao.ultimos4Digitos}
                  </div>
                  <div className="text-lg font-bold">{cartao.nome}</div>
                </div>
                <div className="p-3 bg-gray-50">
                  <div className="text-xs text-gray-600 mb-2">
                    {cartao.tipo === "credito" ? "Cartão de Crédito" : "Cartão de Débito"}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 mb-3">
                    {cartao.titular}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(cartao)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deletar(cartao._id)}
                      className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Deletar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
