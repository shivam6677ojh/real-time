import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip)

export default function ChartsPanel({ history }) {
  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' }, tooltip: { enabled: true } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: false } },
  }

  const chartDataPH = useMemo(() => ({
    labels: history.map((h) => h.t),
    datasets: [{ label: 'pH', data: history.map((h) => h.pH), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.2)', tension: 0.3 }],
  }), [history])

  const chartDataTurb = useMemo(() => ({
    labels: history.map((h) => h.t),
    datasets: [{ label: 'Turbidity (NTU)', data: history.map((h) => h.turbidity), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.2)', tension: 0.3 }],
  }), [history])

  return (
    <div className="charts">
      <div className="chart">
        <Line data={chartDataPH} options={chartOptions} />
      </div>
      <div className="chart">
        <Line data={chartDataTurb} options={chartOptions} />
      </div>
    </div>
  )
}
