import React from 'react';
import YearFilter from './components/YearFilter';
import AnnualSummary from './components/AnnualSummary';
import GrapBarChart from './components/GraphBarChart';
import IncomeDetails from './components/IncomeDetails';
import CardExpenseDetails from './components/CardExpenseDetails';

import styles from './page.module.css';

export default function FinanceiroAnual() {
    return (
        <div className={styles.page}>
            <YearFilter />

            <AnnualSummary />

            <GrapBarChart />
            
            <CardExpenseDetails />
          
            <IncomeDetails />
        </div>
    );
};