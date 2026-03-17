"use client";

import { FaFilePdf } from "react-icons/fa";
import styles from './YearFilter.module.css';

export default function YearFilter({ anoAtual, setAno }) {

    function aumentarAno() {
        setAno(anoAtual + 1);
    }

    function diminuirAno() {
        setAno(anoAtual - 1);
    }

    return (
        <div className={styles.year_filter}>

            <button className={styles.btnArrow} onClick={diminuirAno}>◀</button>

            <input
                className={styles.input}
                type="number"
                value={anoAtual}
                onChange={(e) => setAno(Number(e.target.value))}
            />

            <button className={styles.btnArrow} onClick={aumentarAno}>▶</button>

            <button className={styles.btnPdf}>
                <FaFilePdf size={18} />
                Exportar PDF
            </button>

        </div>
    );
}