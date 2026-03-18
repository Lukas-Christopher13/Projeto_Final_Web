"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import styles from "./DespesaTable.module.css";
import { getAuthHeaders } from "@/app/components/Auth/authHeaders";

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

function getBothierClassesBadge(categoria) {
  const badges = {
    "Contas da Casa": styles.badgeCasas,
    "Alimentação": styles.badgeAlimentacao,
    "Transporte": styles.badgeTransporte,
    "Saúde": styles.badgeSaude,
    "Educação": styles.badgeEducacao,
    "Lazer": styles.badgeLazer,
    "Compras": styles.badgeCompras,
    "Outros": styles.badgeOutros
  };
  return badges[categoria] || styles.badgeOutros;
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
        method: "DELETE",
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(true),
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
      <div className={styles.vazio}>
        <div className={styles.vazioDados}>
          Nenhuma despesa encontrada para este período.
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
              Categoria
            </th>
            <th className={styles.coluna}>
              Conta
            </th>
            <th className={styles.coluna}>
              Data Venc.
            </th>
            <th className={`${styles.coluna} ${styles.colunaAcoes}`}>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {despesas.map((despesa) => (
            <tr
              key={despesa._id}
              className={styles.linha}
            >
              {editingId === despesa._id ? (
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
                    <select
                      value={editForm.categoria ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, categoria: e.target.value }))
                      }
                      className={styles.select}
                    >
                      {CATEGORIAS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={styles.celula}>
                    <select
                      value={editForm.vinculo ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, vinculo: e.target.value }))
                      }
                      className={styles.select}
                    >
                      {VINCULOS.map((v) => (
                        <option key={v.value} value={v.value}>
                          {v.label}
                        </option>
                      ))}
                    </select>
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
                  <td className={`${styles.celula} ${styles.celulaAcoes}`}>
                    <button
                      onClick={() => handleEditSave(despesa._id)}
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
                    {despesa.descricao}
                  </td>
                  <td className={`${styles.celula} ${styles.celulaValor}`}>
                    {formatCurrency(despesa.valor)}
                  </td>
                  <td className={styles.celula}>
                    <span className={`${styles.badge} ${getBothierClassesBadge(despesa.categoria)}`}>
                      {despesa.categoria.substring(0, 3)}...
                    </span>
                  </td>
                  <td className={styles.celula}>
                    {despesa.vinculo === "conta_corrente" ? "Conta Corrente" : "Cartão Crédito"}
                  </td>
                  <td className={styles.celula}>
                    {formatDate(despesa.data)}
                  </td>
                  <td className={`${styles.celula} ${styles.celulaAcoes}`}>
                    <div className={styles.botoesEvento}>
                      <button
                        onClick={() => handleEdit(despesa)}
                        className={styles.botaoIcon}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deletar(despesa._id, despesa.parcelaId)}
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
