import styles from './IncomeDetails.module.css';

export default function IncomeDetails() {
    return (
        <div className={styles.income_details}>
            <h1>Detalhamento de Rendas no Ano</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>23/02/2023</td>
                        <td>Salário</td>
                        <td>R$ 1.400,00</td>
                    </tr>
                    <tr>
                        <td>23/02/2023</td>
                        <td>Salário</td>
                        <td>R$ 1.400,00</td>
                    </tr>
                    <tr>
                        <td>23/02/2023</td>
                        <td>Salário</td>
                        <td>R$ 1.400,00</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
