import React from 'react';
import YearFilter from './components/YearFilter';
import AnnualSummary from './components/AnnualSummary';
import BarChart from './components/BarChart';
import IncomeDetails from './components/IncomeDetails';
import CardExpenseDetails from './components/CardExpenseDetails';

export default function FinanceiroAnual() {
    return (
        <div>
            <YearFilter />
            <AnnualSummary />
            <BarChart />
            <CardExpenseDetails />
            <IncomeDetails />
        </div>
    );
}
