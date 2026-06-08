export default function KPICard({
  titulo,
  valor
}) {
  return (
    <div className="kpi-card">
      <h3>{titulo}</h3>
      <h2>{valor}</h2>
    </div>
  )
}