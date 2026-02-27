import Grafico from "./grafico"
import Total from "./Total"
import AdicionarAReserva from "./adicionar_a_reserva"
import Historico from "./historico"

export default function ReservasInvestimentos() {
    return (
        <main>
            <h1>Minhas Reservas</h1>

            <Grafico></Grafico>
            <Total></Total>
            <AdicionarAReserva></AdicionarAReserva>
            <Historico></Historico>

        </main>
    )
}