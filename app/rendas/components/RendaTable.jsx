"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import styles from "./RendaTable.module.css";
import { getAuthHeaders } from "@/app/components/Auth/authHeaders";

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
        method: "DELETE",
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(true),
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
      <div className={styles.vazio}>
        <div className={styles.vazioDados}>
          Nenhuma renda encontrada para este período.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabela}>
      <table className={styles.tabelaElemento}>
        <thead className={styles.cabecalho}>
          <tr>
            <th className={styles.coluna}>
              Descrição
            </th>
            <th className={styles.coluna}>
              Valor
            </th>
            <th className={styles.coluna}>
              Data
            </th>
            <th className={styles.coluna}>
              Tipo
            </th>
            <th className={`${styles.coluna} ${styles.colunaAcoes}`}>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {rendas.map((renda) => (
            <tr
              key={renda._id}
              className={styles.linha}
            >
              {editingId === renda._id ? (
                <>
                  <td className={styles.celula}>
                    <input
                      type="text"
                      value={editForm.descricao ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, descricao: e.target.value }))
                      }
                      className={styles.entrada}
                    />
                  </td>
                  <td className={styles.celula}>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.valor ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, valor: e.target.value }))
                      }
                      className={styles.entrada}
                    />
                  </td>
                  <td className={styles.celula}>
                    <input
                      type="date"
                      value={editForm.data?.split('T')[0] ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, data: e.target.value }))
                      }
                      className={styles.entrada}
                    />
                  </td>
                  <td className={styles.celula}>
                    <select
                      value={editForm.tipo ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, tipo: e.target.value }))
                      }
                      className={styles.select}
                    >
                      {TIPOS.map((t) => (
                        <option key={t} value={t.toLowerCase()}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`${styles.celula} ${styles.celulaAcoes}`}>
                    <button
                      onClick={() => handleEditSave(renda._id)}
                      className={styles.botaoAzul}
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className={styles.botaoCinza}
                    >
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className={styles.celula}>
                    {renda.descricao}
                  </td>
                  <td className={styles.celula}>
                    {formatCurrency(renda.valor)}
                  </td>
                  <td className={styles.celula}>
                    {formatDate(renda.data)}
                  </td>
                  <td className={styles.celula}>
                    {renda.tipo}
                  </td>
                  <td className={`${styles.celula} ${styles.celulaAcoes}`}>
                    <div className={styles.botoesEvento}>
                      <button
                        onClick={() => handleEdit(renda)}
                        className={styles.botaoIcon}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deletar(renda._id)}
                        className={styles.botaoIcon}
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
