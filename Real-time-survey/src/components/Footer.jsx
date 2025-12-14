export default function Footer() {
  return (
    <footer className="footer footer-glass">
      <div className="footer-grid">
        <div>
          <h4>Advantages</h4>
          <p>Low cost, rapid setup, real-time visualization concept, scalable to IoT.</p>
        </div>
        <div>
          <h4>Limitations</h4>
          <p>Simulated data, no physical sensors, limited parameters.</p>
        </div>
        <div>
          <h4>Future Scope</h4>
          <p>IoT sensors, cloud database, AI-based pollution prediction.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="pulse" />
        <small>Concept demo • Delhi Water Bodies Monitor</small>
      </div>
    </footer>
  )
}
