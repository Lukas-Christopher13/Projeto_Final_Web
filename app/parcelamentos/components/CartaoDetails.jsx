"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CartaoDetails({ detalhesCartao }) {
  const [expandedCartao, setExpandedCartao] = useState(null);

  const cartoes = Object.values(detalhesCartao).sort((a, b) => b.total - a.total);

  if (cartoes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Detalhes por Cartão/Conta</h3>
        <p className="text-center text-gray-600 text-sm py-6">
          Nenhuma dívida futura encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Detalhes por Cartão/Conta</h3>

      <div className="space-y-4">
        {cartoes.map((cartao) => (
          <div key={cartao.nome} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header do Cartão */}
            <button
              onClick={() =>
                setExpandedCartao(
                  expandedCartao === cartao.nome ? null : cartao.nome
                )
              }
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-8 rounded flex items-center justify-center"
                  style={{ backgroundColor: cartao.cor }}
                >
                  <span className="text-xs font-bold text-white truncate px-1">
                    {cartao.nome.substring(0, 3).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {cartao.nome}
                  </p>
                  <p className="text-xs text-gray-600">
                    {cartao.tipo === "conta_corrente"
                      ? "Conta Corrente"
                      : "Cartão Crédito"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-600">Total a Vencer</p>
                  <p className="text-sm font-bold text-red-600">
                    {formatCurrency(cartao.total)}
                  </p>
                </div>
                {expandedCartao === cartao.nome ? (
                  <ChevronUp size={20} className="text-gray-600" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600" />
                )}
              </div>
            </button>

            {/* Itens expandem quando clicado */}
            {expandedCartao === cartao.nome && (
              <div className="border-t border-gray-200 bg-gray-50 p-4 max-h-96 overflow-y-auto">
            {Object.entries(cartao.itens)
            .sort(([mesA], [mesB]) => {
                const mesesMap = {
                janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
                julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
                };

                // Extrai o mês e o ano das strings (ex: "Março de 2026")
                const [nomeMesA, , anoA] = mesA.toLowerCase().split(" ");
                const [nomeMesB, , anoB] = mesB.toLowerCase().split(" ");

                const dataA = new Date(anoA, mesesMap[nomeMesA]);
                const dataB = new Date(anoB, mesesMap[nomeMesB]);

                return dataA - dataB;
            }).map(([mes, itens]) => (
                    <div key={mes} className="mb-4 last:mb-0">
                      <p className="text-sm font-bold text-gray-900 mb-2 capitalize">
                        {mes}
                      </p>
                      <div className="space-y-2">
                        {itens.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start text-xs pl-2 border-l-2 border-gray-300 py-1">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-gray-900 font-medium">
                                  {item.descricao}
                                </p>
                                {item.parcelaInfo && (
                                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                    {item.parcelaInfo}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mt-1">
                                {item.categoria}
                              </p>
                            </div>
                            <p className="text-gray-600 font-semibold ml-2 whitespace-nowrap">
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
