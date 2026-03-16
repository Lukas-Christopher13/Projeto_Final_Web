"use client";

import { useState } from "react";
import styles from "./RendaForm.module.css";

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
    <div className={styles.formulario}>

      <h2 className={styles.titulo}>
        Adicionar Nova Renda
      </h2>

      <form className={styles.grid} onSubmit={adicionarRenda}>

        <div className={styles.campo}>
          <label htmlFor="descricao" className={styles.label}>Descrição</label>
          <input
            id="descricao"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={styles.entrada}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="valor" className={styles.label}>Valor (R$)</label>
          <input
            id="valor"
            type="number"
            min="0"
            step="0.01"
            placeholder="R$ 0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className={styles.entrada}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="tipo" className={styles.label}>Tipo</label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className={styles.select}
          >
            {TIPOS.map((t) => (
              <option key={t} value={t.toLowerCase()}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="data" className={styles.label}>Data</label>
          <input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={styles.entrada}
          />
        </div>

        <div className={styles.acoes}>
          <button 
            type="submit"
            className={styles.botaoEnviar}
          >
            Adicionar
          </button>
        </div>
      </form>
    </div>
  );
}
