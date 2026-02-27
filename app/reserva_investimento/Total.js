import styles from "@/app/reserva_investimento/page.module.css"

export default function Total() {
    return(
        <main className={styles.total}>
            <p className={styles.titulo_total}>Total Guardado Atualmente</p>
            <p className={styles.total_guardado}>R$ 5.200,00</p>
        </main>
    )
}