import React from 'react';
import YearFilter from './components/YearFilter';
import AnnualSummary from './components/AnnualSummary';
import BarChart from './components/BarChart';
import IncomeDetails from './components/IncomeDetails';
import CardExpenseDetails from './components/CardExpenseDetails';

import styles from './page.module.css';

export default function FinanceiroAnual() {
    return (
        <div className={styles.page}>
            <YearFilter />

            <AnnualSummary />

            <BarChart />
            
            <CardExpenseDetails />
          
            <IncomeDetails />
        </div>
    );
};