import styles from './AnnualSummary.module.css';

export default function AnnualSummary() {
    return (
        <div className={styles.container}>
            <h1>Relatório Financeiro Anual</h1>
            <p>Resumo do ano tall</p>

            <div className={styles.resumo}>

                <div className={styles.renda}>

                </div>

                <div className={styles.despesa}>

                </div>

                <div className={styles.saldo}>

                </div>

            </div>
        </div>
    );
}