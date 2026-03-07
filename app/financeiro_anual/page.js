"use client";

import React, { useState } from 'react';
import YearFilter from './components/YearFilter';
import AnnualSummary from './components/AnnualSummary';
import GrapBarChart from './components/GraphBarChart';
import IncomeDetails from './components/IncomeDetails';
import CardExpenseDetails from './components/CardExpenseDetails';

import styles from './page.module.css';

export default function FinanceiroAnual() {
    const [ano, setAno] = useState(new Date().getFullYear());

    return (
        <div className={styles.page}>
            <YearFilter anoAtual={ano} setAno={setAno} />

            <AnnualSummary anoAtual={ano} />

            <GrapBarChart anoAtual={ano} />
            
            <CardExpenseDetails anoAtual={ano} />
          
            <IncomeDetails />
        </div>
    );
};