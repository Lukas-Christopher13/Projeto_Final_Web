import { FaFile } from "react-icons/fa"
import styles from "@/app/reserva_investimento/components/ExportarHistoricoButton.module.css"

export default function ExportarHistoricoButton() {

    async function exportarPlanilha() {
        const response = await fetch("/api/aportes/exportar");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "aportes.xlsx";
        link.click();

        window.URL.revokeObjectURL(url)
    }

    return(
        <button className={styles.button} onClick={exportarPlanilha}>
            <FaFile size={16} />
            <span>Exportar Histórico</span>
        </button>
    )
}