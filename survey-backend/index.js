import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const ORIGIN = process.env.ORIGIN || 'http://localhost:5173'
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/survey_demo'
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

app.use(cors({ origin: ORIGIN }))
app.use(express.json())

// Mongo connection
mongoose.connect(MONGODB_URI, { dbName: 'survey_demo' }).then(() => {
  console.log('MongoDB connected')
}).catch((e) => {
  console.error('MongoDB connection error:', e.message)
})

// Schemas / Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, index: true },
  passwordHash: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true })

const submissionSchema = new mongoose.Schema({
  bodyId: String,
  bodyName: String,
  observation: String,
  pollution: { type: String, enum: ['Low', 'Medium', 'High'] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
const Submission = mongoose.model('Submission', submissionSchema)

// Auth helpers
function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
}

function authRequired(req, res, next) {
  const hdr = req.headers.authorization || ''
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  next()
}

// Demo water bodies and simulation
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

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ error: 'User already exists' })
    const passwordHash = await bcrypt.hash(password, 10)
    const userCount = await User.estimatedDocumentCount()
    const role = userCount === 0 ? 'admin' : 'user'
    const user = await User.create({ name: name || email.split('@')[0], email, passwordHash, role })
    const token = signToken(user)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = signToken(user)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/auth/me', authRequired, async (req, res) => {
  const user = await User.findById(req.user.sub).select('_id name email role')
  res.json({ user })
})

// Basic data endpoints
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

// Submissions (protected)
app.post('/api/submissions', authRequired, async (req, res) => {
  try {
    const { bodyId, bodyName, observation, pollution } = req.body
    if (!bodyId || !pollution) return res.status(400).json({ error: 'bodyId and pollution required' })
    const doc = await Submission.create({ bodyId, bodyName, observation, pollution, userId: req.user.sub })
    res.status(201).json({ id: doc._id })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/submissions', authRequired, async (req, res) => {
  // Allow admins to see all, users see their own
  const query = req.user.role === 'admin' ? {} : { userId: req.user.sub }
  const items = await Submission.find(query).sort({ createdAt: -1 }).limit(200)
  res.json(items)
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
  console.log(`CORS origin: ${ORIGIN}`)
})
