import styles  from "@/app/reserva_investimento/historico.module.css"
import ExportarHistoricoButton from "./components/ExportarHistoricoButton"

const reservas = [
    { id: 1, fonte: "Salário", valor: 1200, data: "01/02/2026" },
    { id: 2, fonte: "Venda Item 13", valor: 350, data: "10/02/2026" },
    { id: 3, fonte: "Freelance", valor: 800, data: "15/02/2026" }
  ]

export default function Historico() {
    return (
        <main className={styles.historico}>

            <header className={styles.header} >
                <p className={styles.titulo}>Histórico de Reservas</p>
                <ExportarHistoricoButton />
            </header>

            <table className={styles.tabela}>
                <thead className={styles.cabesalho_tabela}>
                    <tr>
                        <th>FONTE</th>
                        <th>VALOR</th>
                        <th>DATA</th>
                        <th>AÇÕES</th>
                    </tr>
                </thead>
                <tbody className={styles.linhas_tabela}>
                    {reservas.map((reserva) => (
                    <tr key={reserva.id}>
                        <td>{reserva.fonte}</td>
                        <td>R$ {reserva.valor}</td>
                        <td>{reserva.data}</td>
                        <td>Ação</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}