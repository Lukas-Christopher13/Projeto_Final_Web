import styles  from "@/app/reserva_investimento/page.module.css"

export default function Grafico() {
    return (
        <main>
            <p className={styles.titulo_do_grafico} >Evolução das Reservas</p>
            <figure className={styles.conteudo_do_grafico}></figure>
        </main>
    )
}