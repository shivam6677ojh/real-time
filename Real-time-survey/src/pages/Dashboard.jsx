import { useEffect, useState } from 'react'
import { WATER_BODIES, simulateReadings, statusFor } from '../data'
import StatsPanel from '../components/StatsPanel'
import ChartsPanel from '../components/ChartsPanel'
import MapView from '../components/MapView'

export default function Dashboard() {
  const [readings, setReadings] = useState(simulateReadings())
  const [selected, setSelected] = useState(WATER_BODIES[0].id)

  useEffect(() => {
    const id = setInterval(() => setReadings(simulateReadings()), 4000)
    return () => clearInterval(id)
  }, [])

  const current = readings[selected]
  const currentStatus = statusFor(current)

  return (
    <section className="top">
      <MapView bodies={WATER_BODIES} readings={readings} onSelect={setSelected} />
      <div>
        <StatsPanel bodies={WATER_BODIES} selected={selected} onSelect={setSelected} current={current} status={currentStatus} />
        <ChartsPanel history={current.history} />
      </div>
    </section>
  )
}
