import styles from './AnnualSummary.module.css';

export default function AnnualSummary() {
    return (
        <div className={styles.annual_summary}>
            <h1>Relatório Financeiro Anual</h1>
            <p>Resumo do ano tall</p>

            <div className={styles.resumo}>

                <div className={styles.renda}>
                    <p className={styles.renda_titulo}>Total de Rendas do Ano </p>
                    <p className={styles.renda_valor}> R$ 1000,00</p>
                </div>

                <div className={styles.despesa}>
                    <p className={styles.despesa_titulo}>Total de Despesas do Ano</p>
                    <p className={styles.despesa_valor}> R$ 1000,00</p>
                </div>

                <div className={styles.saldo}>
                    <p className={styles.saldo_titulo}>Saldo Final do Ano</p>
                    <p className={styles.saldo_valor}> R$ 1000,00</p>
                </div>

            </div>
        </div>
    );
}