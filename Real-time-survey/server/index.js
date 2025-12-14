import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 4000
app.use(cors())
app.use(express.json())

// Water bodies
const WATER_BODIES = [
  { id: 'yamuna', name: 'Yamuna River', latlng: [28.7351, 77.2648] },
  { id: 'najafgarh', name: 'Najafgarh Drain', latlng: [28.6155, 76.9803] },
  { id: 'sanjay', name: 'Sanjay Lake', latlng: [28.6193, 77.3171] },
  { id: 'hauz', name: 'Hauz Khas Lake', latlng: [28.5491, 77.2010] },
]

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const ts = () => new Date().toLocaleTimeString([], { hour12: false })

function simulateReadings() {
  const out = {}
  for (const wb of WATER_BODIES) {
    const pH = clamp(7 + (Math.random() - 0.5) * 1.2, 5.8, 8.8)
    const turbidity = clamp(3 + (Math.random() - 0.5) * 2.2, 0.5, 8)
    const level = clamp(3.5 + (Math.random() - 0.5) * 1.2, 2.0, 5.0)
    const history = []
    let hpH = pH
    let hT = turbidity
    for (let i = 0; i < 12; i++) {
      hpH = clamp(hpH + (Math.random() - 0.5) * 0.2, 5.5, 9)
      hT = clamp(hT + (Math.random() - 0.5) * 0.6, 0.5, 8)
      history.push({ t: ts(), pH: hpH, turbidity: hT })
    }
    out[wb.id] = { pH, turbidity, level, history }
  }
  return out
}

function statusFor(r) {
  if (r.pH < 6.5 || r.pH > 8.5 || r.turbidity > 5 || r.level < 2.5) return 'Polluted'
  if (r.turbidity > 3.5 || r.level < 3) return 'Moderate'
  return 'Safe'
}

// REST endpoints
app.get('/api/bodies', (req, res) => {
  res.json(WATER_BODIES)
})

app.get('/api/readings', (req, res) => {
  const readings = simulateReadings()
  const withStatus = Object.fromEntries(
    Object.entries(readings).map(([id, r]) => [id, { ...r, status: statusFor(r) }])
  )
  res.json(withStatus)
})

// SSE stream for updates every 4s
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  const send = () => {
    const readings = simulateReadings()
    const withStatus = Object.fromEntries(
      Object.entries(readings).map(([id, r]) => [id, { ...r, status: statusFor(r) }])
    )
    res.write(`data: ${JSON.stringify(withStatus)}\n\n`)
  }

  send()
  const timer = setInterval(send, 4000)
  req.on('close', () => clearInterval(timer))
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
