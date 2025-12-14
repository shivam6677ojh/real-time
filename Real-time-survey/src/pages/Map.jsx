import { useEffect, useState } from 'react'
import { WATER_BODIES, simulateReadings } from '../data'
import MapView from '../components/MapView'

export default function MapPage() {
  const [readings, setReadings] = useState(simulateReadings())
  const [selected, setSelected] = useState(WATER_BODIES[0].id)

  useEffect(() => {
    const id = setInterval(() => setReadings(simulateReadings()), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="top">
      <MapView bodies={WATER_BODIES} readings={readings} onSelect={setSelected} />
    </section>
  )
}
