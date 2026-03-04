import styles from './YearFilter.module.css';

export default function YearFilter() {
    return (
        <div className={styles.container}>
            <input type='data'></input>
            <button>Exportar PDF</button>
        </div>
    );
}