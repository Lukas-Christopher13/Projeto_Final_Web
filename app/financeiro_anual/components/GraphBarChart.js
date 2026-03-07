"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer
} from "recharts";

import styles from './GraphBarChart.module.css';
import { useState, useEffect } from "react";

export default function GraphBarChart(props) {
    const [data, setData] = useState([])

    useEffect(() => {
        async function getGraphBarChartData() {
            const response = await fetch((`/api/graph_bar_chart/${props.anoAtual}`));
            const graphData = await response.json();
            setData(graphData)
        }
        getGraphBarChartData();
    }, [props.anoAtual]);

    return (
        <div className={styles.GraphbarChart}>
            <h1>Rendas vs. Despesas Mensais</h1>
            <div className={styles.graph}>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" />
                        
                        <XAxis dataKey="mes" />
                        <YAxis />

                        <Tooltip />
                        <Legend
                            iconType="rect" 
                            verticalAlign="top" 
                            align="center"
                        />

                        <Bar dataKey="renda" name="Renda" fill="#16a34a" >
                            <LabelList dataKey="renda" fill="#000" position="center" />
                        </Bar>
                        <Bar dataKey="despesa" name="Despesa" fill="#dc2626">
                            <LabelList dataKey="despesa" fill="#000" position="center" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
