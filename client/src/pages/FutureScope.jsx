export default function FutureScope() {
  const items = [
    'Mobile application', 'Payment gateway', 'AI book recommendations', 'Chat between users',
    'Location-based exchange', 'Rating and review system', 'Real-time notifications',
    'User verification', 'Multi-language support', 'Advanced admin analytics', 'Blockchain-based transaction records'
  ];
  return (
    <div className="container section">
      <h1>Future Scope <span className="badge amber">Not yet implemented</span></h1>
      <p className="muted">The current v1 does NOT include online payments, delivery/logistics, AI recommendations, real-time chat, multi-language UI, KYC, or advanced analytics. These are planned enhancements:</p>
      <div className="cards4">
        {items.map((f) => <div key={f} className="feature-card"><h4>🔮 {f}</h4><span className="badge grey">Future Scope</span></div>)}
      </div>
    </div>
  );
}
