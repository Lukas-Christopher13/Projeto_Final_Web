"use client";

import { useEffect, useState, useCallback } from "react";
import DespesaForm from "./components/DespesaForm";
import DespesaTable from "./components/DespesaTable";
import { FileText } from "lucide-react";
import styles from "./page.module.css";

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export default function DespesasPage() {
  const [despesas, setDespesas] = useState([]);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());

  const carregarDespesas = useCallback(async () => {
    try {
      const res = await fetch(`/api/despesas?mes=${mes}&ano=${ano}`);
      if (!res.ok) throw new Error("Falha ao buscar");
      const data = await res.json();
      setDespesas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setDespesas([]);
    }
  }, [mes, ano]);

  useEffect(() => {
    carregarDespesas();
  }, [carregarDespesas]);

  function proximoMes() {
    if (mes === 12) {
      setMes(1);
      setAno((prev) => prev + 1);
    } else {
      setMes((prev) => prev + 1);
    }
  }

  function mesAnterior() {
    if (mes === 1) {
      setMes(12);
      setAno((prev) => prev - 1);
    } else {
      setMes((prev) => prev - 1);
    }
  }

  function mesAtual() {
    const hoje = new Date();
    setMes(hoje.getMonth() + 1);
    setAno(hoje.getFullYear());
  }

  function handleExport() {
    const header = "DESCRIÇÃO,VALOR,DATA,CATEGORIA,VÍNCULO\n";
    const rows = despesas
      .map(
        (d) =>
          `"${d.descricao}","R$ ${d.valor.toFixed(2)}","${new Date(d.data).toLocaleDateString('pt-BR')}","${d.categoria}","${d.vinculo}"`
      )
      .join("\n");
    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `despesas-${MESES[mes - 1]}-${ano}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.conteudo}>
        <div className={styles.container}>
          <h1 className={styles.titulo}>Gerenciar Despesas</h1>
          <div className={styles.formulario}>
            <DespesaForm atualizar={carregarDespesas} />
          </div>

          <div className={styles.cabecalho}>
            <h2 className={styles.subtitulo}>
              Despesas de {MESES[mes - 1]} de {ano}
            </h2>
            <div className={styles.acoes}>
              <button
                onClick={handleExport}
                className={styles.botaoExportar}
              >
                <FileText size={15} />
                Exportar
              </button>
              <div className={styles.botoesNavegacao}>
                <button
                  onClick={mesAnterior}
                  className={styles.botaoNav}
                >
                  Anterior
                </button>
                <button
                  onClick={mesAtual}
                  className={`${styles.botaoNav} ${styles.botaoNavAtivo}`}
                >
                  Mês Atual
                </button>
                <button
                  onClick={proximoMes}
                  className={styles.botaoNav}
                >
                  Próximo
                </button>
              </div>
            </div>
          </div>

          <div className={styles.tabela}>
            <DespesaTable despesas={despesas} atualizar={carregarDespesas} />
          </div>
        </div>
      </div>
    </div>
  );
}
