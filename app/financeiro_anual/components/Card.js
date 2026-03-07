"use client"

import { FaCreditCard } from "react-icons/fa";

import styles from "./Card.module.css"

const coresCartao = {
    "Nubank": {
        background: "#8A05BE",
        fonte: "#FFFFFF"
    },
    "Mercado Pago": {
        background: "#FFE600",
        fonte: "#000000"
    },
    "Banco Master": {
        background: "#015A6B",
        fonte: "#FFFFFF"
    }
};

export default function Card(props) {
    const fonte = coresCartao[props.nome].fonte || "#000";
    const background = coresCartao[props.nome].background || "#999";

    return (
        <div className={styles.card} style={{ backgroundColor: background }}>
            <div className={styles.card_text}>
                <FaCreditCard  style={{ color: fonte, fontSize: "16px" }} />
                <p style={{color: fonte}} >{props.nome}</p>
            </div>
            <div className={styles.black_bar}></div>
        </div>
    )
}