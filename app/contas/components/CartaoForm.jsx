"use client";

import { useState } from "react";
import styles from "./CartaoForm.module.css";

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
    <div className={styles.formulario}>
      <h2 className={styles.titulo}>Adicionar Conta/Cartão</h2>

      {error && (
        <div className={styles.erro}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.campo}>
            <label className={styles.label}>
              Nome da Conta/Cartão
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) =>
                setFormData((f) => ({ ...f, nome: e.target.value }))
              }
              className={styles.entrada}
              placeholder="Ex: Nubank, MerPago"
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>
              Tipo
            </label>
            <select
              value={formData.tipo}
              onChange={(e) =>
                setFormData((f) => ({ ...f, tipo: e.target.value }))
              }
              className={styles.select}
            >
              <option value="credito">Cartão de Crédito</option>
              <option value="debito">Cartão de Débito</option>
            </select>
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>
              Nome do Titular
            </label>
            <input
              type="text"
              required
              value={formData.titular}
              onChange={(e) =>
                setFormData((f) => ({ ...f, titular: e.target.value }))
              }
              className={styles.entrada}
              placeholder="Ex: João Silva"
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>
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
              className={styles.entrada}
              placeholder="Ex: 9999"
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>
              Cor do Cartão
            </label>
            <div className={styles.containerCor}>
              <input
                type="color"
                value={formData.cor}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, cor: e.target.value }))
                }
                className={styles.inputCor}
              />
              <div
                className={styles.preview}
                style={{ backgroundColor: formData.cor }}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.botaoEnviar}
        >
          {loading ? "Adicionando..." : "Adicionar"}
        </button>
      </form>
    </div>
  );
}
