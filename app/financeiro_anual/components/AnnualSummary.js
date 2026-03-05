import styles from './AnnualSummary.module.css';

export default function AnnualSummary() {
    return (
        <div className={styles.annual_summary}>
            <h1>Relatório Financeiro Anual</h1>
            <h2>Resumo do ano tall</h2>

            <div className={styles.resumo}>

                <div className={styles.renda}>
                    <p className={styles.titulo}>Total de Rendas do Ano </p>
                    <p className={styles.valor}> R$ 1000,00</p>
                </div>

                <div className={styles.despesa}>
                    <p className={styles.titulo}>Total de Despesas do Ano</p>
                    <p className={styles.valor}> R$ 1000,00</p>
                </div>

                <div className={styles.saldo}>
                    <p className={styles.titulo}>Saldo Final do Ano</p>
                    <p className={styles.valor}> R$ 1000,00</p>
                </div>

            </div>
        </div>
    );
}