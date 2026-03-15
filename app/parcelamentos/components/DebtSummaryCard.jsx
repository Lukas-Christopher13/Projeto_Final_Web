"use client";

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DebtSummaryCard({ totalDividas }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-red-500 flex flex-col items-center justify-center text-center">
      <p className="text-sm text-gray-600 mb-3 font-medium">Dívida Futura Total</p>
      <div className="text-5xl font-bold text-red-600">
        {formatCurrency(totalDividas)}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Valores parcelados a vencer nos próximos meses
      </p>
    </div>
  );
}
