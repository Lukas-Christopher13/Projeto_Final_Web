"use client";

import { useState, useEffect } from "react";
import styles from "./DespesaForm.module.css";
import { getAuthHeaders } from "@/app/components/Auth/authHeaders";

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
        const response = await fetch("/api/cartoes", {
          headers: getAuthHeaders(),
        });
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
        headers: getAuthHeaders(true),
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
    <div className={styles.formulario}>

      <h2 className={styles.titulo}>
        Adicionar Nova Despesa
      </h2>

      <form className={styles.grid} onSubmit={adicionarDespesa}>

        <div className={styles.campo}>
          <label htmlFor="descricao" className={styles.label}>Descrição</label>
          <input
            id="descricao"
            type="text"
            placeholder="Ex: Conta de luz"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={styles.entrada}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="valor" className={styles.label}>Valor Total (R$)</label>
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
          <label htmlFor="data" className={styles.label}>Data da Compra / 1º Vencimento</label>
          <input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={styles.entrada}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="categoria" className={styles.label}>Categoria</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={styles.select}
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="parcelas" className={styles.label}>Nº de Parcelas</label>
          <input
            id="parcelas"
            type="number"
            min="1"
            max="48"
            value={numeroParcelas}
            onChange={(e) => setNumeroParcelas(e.target.value)}
            className={styles.entrada}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="vinculo" className={styles.label}>Conta / Cartão (Opcional)</label>
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
            className={styles.select}
          >
            <option value="">Nenhum (Padrão)</option>
            {cartoes.map((cartao) => (
              <option key={cartao._id} value={cartao._id}>
                {cartao.nome} - {cartao.tipo === "credito" ? "Crédito" : "Débito"} (•{cartao.ultimos4Digitos})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.acoes}>
          <button 
            type="submit"
            className={styles.botaoEnviar}
          >
            Adicionar Despesa
          </button>
        </div>

      </form>

    </div>
  );
}
