"use client";

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PaymentSchedule({ resumoMensal }) {
  const meses = Object.entries(resumoMensal).sort((a, b) => {
    const dataA = new Date(a[0]);
    const dataB = new Date(b[0]);
    return dataA - dataB;
  });

  if (meses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo Mensal (Geral)</h3>
        <p className="text-center text-gray-600 text-sm py-6">
          Nenhuma dívida futura encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo Mensal (Geral)</h3>
      
      <div className="space-y-3">
        {meses.map(([mes, total]) => (
          <div
            key={mes}
            className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900 capitalize">
              {mes}
            </span>
            <span className="text-sm font-semibold text-red-600">
              {formatCurrency(total)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
