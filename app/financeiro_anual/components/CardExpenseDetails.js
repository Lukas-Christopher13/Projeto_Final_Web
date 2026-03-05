import Card from "./Card";
import styles from "./CardExpenseDetails.module.css"

export default function CardExpenseDetails() {
    return (
        <div className={styles.card_expense_details}>
            <h1>Despesas por Conta/Cartão</h1>
    
            <table className={styles.table}>
                <tbody>
                    <tr className={styles.table_row}>
                        <th><Card/></th>
                        <th><p>R$ 1000,00</p></th>
                    </tr>
                    <tr className={styles.table_row}>
                        <th><Card/></th>
                        <th><p>R$ 1000,00</p></th>
                    </tr>
                    <tr className={styles.table_row}>
                        <th>Boleto/Pix</th>
                        <th><p>R$ 1000,00</p></th>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

