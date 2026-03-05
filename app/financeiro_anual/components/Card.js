import { FaCreditCard } from "react-icons/fa";

import styles from "./Card.module.css"

export default function Card() {
    return (
        <div className={styles.card}>
            <div className={styles.card_text}>
                <FaCreditCard size={16}/>
                <p>Nubank</p>
            </div>
            <div className={styles.black_bar}></div>
        </div>
    )
}