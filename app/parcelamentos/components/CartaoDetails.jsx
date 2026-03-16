"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./CartaoDetails.module.css";

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CartaoDetails({ detalhesCartao }) {
  const [expandedCartao, setExpandedCartao] = useState(null);

  const cartoes = Object.values(detalhesCartao).sort((a, b) => b.total - a.total);

  if (cartoes.length === 0) {
    return (
      <div className={styles.card}>
        <h3 className={styles.titulo}>Detalhes por Cartão/Conta</h3>
        <p className={styles.vazio}>
          Nenhuma dívida futura encontrada
        </p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.titulo}>Detalhes por Cartão/Conta</h3>

      <div className={styles.lista}>
        {cartoes.map((cartao) => (
          <div key={cartao.nome} className={styles.cartao}>
            {/* Header do Cartão */}
            <button
              onClick={() =>
                setExpandedCartao(
                  expandedCartao === cartao.nome ? null : cartao.nome
                )
              }
              className={styles.cabecalho}
            >
              <div className={styles.cabecalhoEsquerda}>
                <div
                  className={styles.iconeCartao}
                  style={{ backgroundColor: cartao.cor }}
                >
                  <span className={styles.iconeTexto}>
                    {cartao.nome.substring(0, 3).toUpperCase()}
                  </span>
                </div>
                <div className={styles.cabecalhoTexto}>
                  <p className={styles.cabecalhoNome}>
                    {cartao.nome}
                  </p>
                  <p className={styles.cabecalhoTipo}>
                    {cartao.tipo === "conta_corrente"
                      ? "Conta Corrente"
                      : "Cartão Crédito"}
                  </p>
                </div>
              </div>

              <div className={styles.cabecalhoDireita}>
                <div className={styles.totalVencer}>
                  <p className={styles.totalLabel}>Total a Vencer</p>
                  <p className={styles.totalValor}>
                    {formatCurrency(cartao.total)}
                  </p>
                </div>
                {expandedCartao === cartao.nome ? (
                  <ChevronUp size={20} className={styles.icone} />
                ) : (
                  <ChevronDown size={20} className={styles.icone} />
                )}
              </div>
            </button>

            {/* Itens expandem quando clicado */}
            {expandedCartao === cartao.nome && (
              <div className={styles.corpo}>
                {Object.entries(cartao.itens)
                  .sort(([mesA], [mesB]) => {
                    const mesesMap = {
                      janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
                      julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
                    };

                    const [nomeMesA, , anoA] = mesA.toLowerCase().split(" ");
                    const [nomeMesB, , anoB] = mesB.toLowerCase().split(" ");

                    const dataA = new Date(anoA, mesesMap[nomeMesA]);
                    const dataB = new Date(anoB, mesesMap[nomeMesB]);

                    return dataA - dataB;
                  })
                  .map(([mes, itens]) => (
                    <div key={mes} className={styles.meses}>
                      <p className={styles.mes}>
                        {mes}
                      </p>
                      <div className={styles.itens}>
                        {itens.map((item, idx) => (
                          <div key={idx} className={styles.item}>
                            <div className={styles.itemDescricao}>
                              <div className={styles.itemTitulo}>
                                <p className={styles.itemNome}>
                                  {item.descricao}
                                </p>
                                {item.parcelaInfo && (
                                  <span className={styles.badge}>
                                    {item.parcelaInfo}
                                  </span>
                                )}
                              </div>
                              <p className={styles.itemCategoria}>
                                {item.categoria}
                              </p>
                            </div>
                            <p className={styles.itemValor}>
                              {formatCurrency(item.valor)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
