"use client";

import { FaFilePdf } from "react-icons/fa";
import styles from './YearFilter.module.css';

export default function YearFilter(props) {
    return (
        <div className={styles.year_filter}>
            <input 
                className={styles.input}
                type="number" 
                min="1900" 
                max="2100" 
                step="1" 
                defaultValue={props.anoAtual}
                onChange={(e) => props.setAno(e.target.value)} />
            <button className={styles.btnPdf}>
                <FaFilePdf size={18} />
                Exportar PDF
            </button>
        </div>
    );
}