import { FaFile } from "react-icons/fa"
import styles from "@/app/reserva_investimento/components/ExportarHistoricoButton.module.css"

export default function ExportarHistoricoButton() {
    return(
        <button className={styles.button}>
            <FaFile size={16} />
            <span>Exportar Histórico</span>
        </button>
    )
}