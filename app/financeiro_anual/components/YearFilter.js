"use client";

import ExportarHistoricoButton from '@/app/components/ExportarHistoricoButton';
import styles from './YearFilter.module.css';

export default function YearFilter() {
    return (
        <div className={styles.year_filter}>
            <input className={styles.input} type="date" />
            <ExportarHistoricoButton />
        </div>
    );
}