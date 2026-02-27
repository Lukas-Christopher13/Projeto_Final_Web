import styles from "@/app/reserva_investimento/adicionar_a_reservar.module.css"

import TextInput from "./components/TextInput"
import Button from "./components/Button"

export default function AdicionarAReserva() {
    return (
        <main className={styles.reserva}>
            <p className={styles.titulo}>Adicionar à Reserva</p>

            <form className={styles.form}>
                <div className={styles.inputs}>
                    <TextInput id="valor" label="Valor (R$)" placeholder="R$ 0,00"/>
                    <TextInput id="data" label="Data"/>
                    <TextInput id="fonte" label="Fonte do Dinheiro (Ex: Sobra do Salário, Venda do Item 13)"/>
                </div>

                <div className={styles.button}>
                    <Button type="submit" value="Guardar Dinheiro"/>
                </div>
            </form>
        </main>
    )
}