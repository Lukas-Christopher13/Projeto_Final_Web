import styles from "@/app/reserva_investimento/page.module.css"

import TextInput from "./components/TextInput"

export default function AdicionarAReserva() {
    return (
        <main className={styles.adicionar_reserva}>
            <p className={styles.titulo_adicionar_reserva}>Adicionar à Reserva</p>

            <form className={styles.adicionar_reserva_form}>
                <TextInput id="valor" value="Valor (R$)"/>
                <TextInput id="data" value="Data"/>
                <TextInput id="fonte" value="Fonte do Dinheiro (Ex: Sobra do Salário, Venda do Item 13)"/>
            </form>
            <input type="submit" value="Guardar Dinheiro"/>

        </main>
    )
}