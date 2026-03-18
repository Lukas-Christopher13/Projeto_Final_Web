"use client";

import html2pdf from "html2pdf.js";
import { FaFilePdf } from "react-icons/fa";
import styles from './YearFilter.module.css';

export default function YearFilter({ anoAtual, setAno }) {
    const gerarPDF = () => {
        const elemento = document.getElementById("pdf-content");

        const opt = {
          margin: [5, 5, 5, 5],
          filename: "relatorio.pdf",
    
          image: {
            type: "jpeg",
            quality: 1,
          },
    
          html2canvas: {
            scale: 3, 
            useCORS: true,
            logging: false,
            scrollY: 0,
          },
    
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
    
          pagebreak: {
            mode: ["avoid-all", "css", "legacy"],
          },
        };
    
        html2pdf().set(opt).from(elemento).save();
    };
    
    
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

            <button className={styles.btnPdf} onClick={gerarPDF}>
                <FaFilePdf size={18} />
                Exportar PDF
            </button>

        </div>
    );
}