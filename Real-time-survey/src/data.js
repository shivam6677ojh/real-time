// Simulated water bodies and readings for Delhi
export const WATER_BODIES = [
  { id: 'yamuna', name: 'Yamuna River', latlng: [28.7351, 77.2648] },
  { id: 'najafgarh', name: 'Najafgarh Drain', latlng: [28.6155, 76.9803] },
  { id: 'sanjay', name: 'Sanjay Lake', latlng: [28.6193, 77.3171] },
  { id: 'hauz', name: 'Hauz Khas Lake', latlng: [28.5491, 77.2010] },
]

// Helper to clamp values
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

// Generate a timestamp label HH:MM:SS
const ts = () => new Date().toLocaleTimeString([], { hour12: false })

// Status rules (simplified for demo)
export function statusFor(r) {
  if (r.pH < 6.5 || r.pH > 8.5 || r.turbidity > 5 || r.level < 2.5) return 'Polluted'
  if (r.turbidity > 3.5 || r.level < 3) return 'Moderate'
  return 'Safe'
}

// Create random walk history for charts
function seedHistory() {
  const history = []
  let pH = 7 + (Math.random() - 0.5) * 0.8
  let turbidity = 3 + (Math.random() - 0.5) * 1.5
  for (let i = 0; i < 12; i++) {
    pH = clamp(pH + (Math.random() - 0.5) * 0.2, 5.5, 9)
    turbidity = clamp(turbidity + (Math.random() - 0.5) * 0.6, 0.5, 8)
    history.push({ t: ts(), pH, turbidity })
  }
  return history
}

export function simulateReadings() {
  const out = {}
  for (const wb of WATER_BODIES) {
    const pH = clamp(7 + (Math.random() - 0.5) * 1.2, 5.8, 8.8)
    const turbidity = clamp(3 + (Math.random() - 0.5) * 2.2, 0.5, 8)
    const level = clamp(3.5 + (Math.random() - 0.5) * 1.2, 2.0, 5.0)
    out[wb.id] = { pH, turbidity, level, history: seedHistory() }
  }
  return out
}
