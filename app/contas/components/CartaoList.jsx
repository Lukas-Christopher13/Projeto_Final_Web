"use client";

import { useState } from "react";
import { Pencil, Trash2, FileText } from "lucide-react";
import styles from "./CartaoList.module.css";
import { getAuthHeaders } from "@/app/components/Auth/authHeaders";

export default function CartaoList({ cartoes, atualizar }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  function exportarCartoes() {
    const headers = ["NOME", "TIPO", "TITULAR", "ÚLTIMOS 4 DÍGITOS"];
    const rows = cartoes.map(c => [
      c.nome,
      c.tipo === "credito" ? "Cartão de Crédito" : "Cartão de Débito",
      c.titular,
      c.ultimos4Digitos
    ]);
    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
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
        method: "DELETE",
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(true),
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
      <div className={styles.vazio}>
        Nenhum cartão cadastrado. Adicione um novo!
      </div>
    );
  }

  return (
    <div className={styles.lista}>
      <div className={styles.cabecalho}>
        <h2 className={styles.titulo}>Contas Cadastradas</h2>
        <div className={styles.acoes}>
          <button 
            onClick={exportarCartoes}
            className={styles.botaoExportar}
          >
            <FileText size={16} />
            Exportar
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {cartoes.map((cartao) => (
          <div key={cartao._id} className={styles.cartao}>
            {editingId === cartao._id ? (
              <div className={styles.edicaoContainer}>
                <div className={styles.edicaoCampos}>
                  <input
                    type="text"
                    value={editForm.nome || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, nome: e.target.value }))
                    }
                    className={styles.entrada}
                    placeholder="Nome"
                  />
                  <select
                    value={editForm.tipo || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, tipo: e.target.value }))
                    }
                    className={styles.select}
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
                    className={styles.entrada}
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
                    className={styles.entrada}
                    placeholder="Últimos 4"
                  />
                  <input
                    type="color"
                    value={editForm.cor || "#6B7280"}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, cor: e.target.value }))
                    }
                    className={styles.inputCor}
                  />
                  <div className={styles.edicaoBotoes}>
                    <button
                      onClick={() => handleEditSave(cartao._id)}
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
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={styles.cartaoTopo}
                  style={{ backgroundColor: cartao.cor || "#6B7280" }}
                >
                  <div className={styles.cartaoTopoTexto}>
                    <div className={styles.cartaoNumero}>
                      Final • {cartao.ultimos4Digitos}
                    </div>
                    <div className={styles.cartaoNome}>{cartao.nome}</div>
                  </div>
                </div>
                <div className={styles.cartaoCorpo}>
                  <div className={styles.cartaoLabel}>
                    {cartao.tipo === "credito" ? "Cartão de Crédito" : "Cartão de Débito"}
                  </div>
                  <div className={styles.cartaoValor}>
                    {cartao.titular}
                  </div>
                  <div className={styles.cartaoAcoes}>
                    <button
                      onClick={() => handleEdit(cartao)}
                      className={styles.botaoIconEditar}
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deletar(cartao._id)}
                      className={styles.botaoIconDeletar}
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
