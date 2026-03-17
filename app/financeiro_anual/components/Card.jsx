"use client"

import { FaCreditCard } from "react-icons/fa";

import styles from "./Card.module.css"

function getContrastColor(hexcolor) {
    if (!hexcolor) return "#000";

    const r = parseInt(hexcolor.substr(1,2),16);
    const g = parseInt(hexcolor.substr(3,2),16);
    const b = parseInt(hexcolor.substr(5,2),16);

    const yiq = ((r*299)+(g*587)+(b*114))/1000;

    return (yiq >= 128) ? "#000" : "#FFF";
}

export default function Card(props) {
    const background = props.cor || "#999";
    const fonte = getContrastColor(background);

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