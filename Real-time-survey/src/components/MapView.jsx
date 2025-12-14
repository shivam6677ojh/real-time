import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { statusFor } from '../data'

const statusColors = {
  Safe: '#22c55e',
  Moderate: '#eab308',
  Polluted: '#ef4444',
}

const markerIcon = (color) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #111"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })

  
export default function MapView({ bodies, readings, onSelect }) {
  return (
    <div className="map">
      <MapContainer center={[28.6139, 77.209]} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {bodies.map((wb) => {
          const r = readings[wb.id]
          const st = statusFor(r)
          return (
            <Marker
              key={wb.id}
              position={wb.latlng}
              icon={markerIcon(statusColors[st])}
              eventHandlers={{ click: () => onSelect?.(wb.id) }}
            >
              <Popup>
                <strong>{wb.name}</strong>
                <div>pH: {r.pH.toFixed(2)}</div>
                <div>Turbidity: {r.turbidity.toFixed(1)} NTU</div>
                <div>Water Level: {r.level.toFixed(2)} m</div>
                <div>Status: {st}</div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
