import styles  from "@/app/reserva_investimento/page.module.css"

export default function Historico() {
    return (
        <main className={styles.historico}>
            <input type="button" value="Exportar Histórico"/>

            <p className={styles.titilo_historico}>Histórico de Reservas</p>

            <table className={styles.tabela_historico}>
                <tr className={styles.cabesalho_tabela_historico}>
                    <th>FONTE</th>
                    <th>VALOR</th>
                    <th>DATA</th>
                    <th>AÇÕES</th>
                </tr>
                <tr>
                    <td>Jill</td>
                    <td>Smith</td>
                    <td>50</td>
                    <td>ação</td>
                </tr>
            </table>
        </main>
    )
}