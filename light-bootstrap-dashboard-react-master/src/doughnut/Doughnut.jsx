import { DoughnutController, Chart, CategoryScale, ArcElement } from 'chart.js';
import React, { useEffect, useRef } from 'react';

Chart.register(DoughnutController, CategoryScale, ArcElement);

export default function Doughnut({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return; 

    const ctx = chartRef.current.getContext('2d');
    const doughnutGraph = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        cutoutPercentage: 30,
        responsive: true,
      }
    });

    return () => doughnutGraph.destroy();
  }, [data]); 

  return (
    <div style={{ height: '400px', width: '400px' }}>
      <canvas ref={chartRef} />
    </div>
  );
}