import Grafico from "./grafico"
import Total from "./Total"
import AdicionarAReserva from "./adicionar_a_reserva"
import Historico from "./historico"

import styles from "@/app/reserva_investimento/page.module.css"

export default function ReservasInvestimentos() {
    return (
        <main className={styles.reserva_investimento}>
            <h1 className={styles.titulo}>Minhas Reservas</h1>
            
            <Grafico></Grafico>
            <Total></Total>
            <AdicionarAReserva></AdicionarAReserva>
            <Historico></Historico>

        </main>
    )
}