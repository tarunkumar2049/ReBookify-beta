export default function About() {
  return (
    <div className="container section">
      <h1>What is ReBookify?</h1>
      <p style={{ fontSize: '1.1rem' }}>ReBookify is a centralized platform designed to make buying, selling and exchanging used books easier for students.</p>
      <div className="cards4">
        <div className="feature-card"><h3>💰 Reduce financial burden</h3><p className="muted">Affordable used textbooks for every student.</p></div>
        <div className="feature-card"><h3>🔁 Promote reuse</h3><p className="muted">Give every book more than one reader.</p></div>
        <div className="feature-card"><h3>🌱 Reduce waste</h3><p className="muted">Keep books out of landfills.</p></div>
        <div className="feature-card"><h3>🤝 Peer-to-peer interaction</h3><p className="muted">A community marketplace built for students.</p></div>
      </div>
      <div className="eco" style={{ marginTop: 30 }}>
        <h2>One Book Can Have More Than One Reader.</h2>
        <p>Reusing books reduces waste. Students save money. Unused books help other students. Peer-to-peer exchange encourages sustainable consumption.</p>
      </div>
      <h2>Improve access to educational resources</h2>
      <p className="muted">One centralized, searchable platform — filter by category, price and condition — so students find books faster instead of hunting through scattered groups and shops.</p>
    </div>
  );
}
