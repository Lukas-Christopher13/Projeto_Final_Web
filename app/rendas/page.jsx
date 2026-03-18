"use client";

import { useEffect, useState, useCallback } from "react";
import RendaForm from "./components/RendaForm";
import RendaTable from "./components/RendaTable";
import { FileText } from "lucide-react";
import styles from "./page.module.css";
import useRequireAuth from "@/app/components/Auth/useRequireAuth";

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export default function RendasPage() {
  useRequireAuth();
  const [rendas, setRendas] = useState([]);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());

  const carregarRendas = useCallback(async () => {
    try {
      const res = await fetch(`/api/rendas?mes=${mes}&ano=${ano}`);
      if (!res.ok) throw new Error("Falha ao buscar");
      const data = await res.json();
      setRendas(data);
    } catch (err) {
      console.error(err);
    }
  }, [mes, ano]);

  useEffect(() => {
    carregarRendas();
  }, [carregarRendas]);

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
    const header = "DESCRIÇÃO,VALOR,DATA,TIPO\n";
    const rows = rendas
      .map(
        (r) =>
          `"${r.descricao}","R$ ${r.valor}","${new Date(r.data).toLocaleDateString('pt-BR')}","${r.tipo}"`
      )
      .join("\n");
    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `rendas-${MESES[mes - 1]}-${ano}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.conteudo}>
        <div className={styles.container}>
          <h1 className={styles.titulo}>Gerenciar Rendas</h1>
          <div className={styles.formulario}>
            <RendaForm atualizar={carregarRendas} />
          </div>

          <div className={styles.cabecalho}>
            <h2 className={styles.subtitulo}>
              Rendas de {MESES[mes - 1]} de {ano}
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
            <RendaTable rendas={rendas} atualizar={carregarRendas} />
          </div>
        </div>
      </div>
    </div>
  );
}
