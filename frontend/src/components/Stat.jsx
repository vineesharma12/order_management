export function Stat({ icon: Icon, label, value, tone = 'green' }) {
  return (
    <article className={`stat ${tone}`}>
      <div className="stat-icon">
        <Icon size={22} aria-hidden="true" />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
