export function PageHeader({ 
  label, 
  title, 
  subtitle, 
  meta 
}: { 
  label: string; 
  title: string; 
  subtitle?: string; 
  meta?: string 
}) {
  return (
    <header className="page-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>{label}</div>
          <h1 className="heading-xl">{title}</h1>
        </div>
        {(subtitle || meta) && (
          <div style={{ textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {subtitle && <div style={{ fontWeight: 600 }}>{subtitle}</div>}
            {meta && <div>{meta}</div>}
          </div>
        )}
      </div>
    </header>
  )
}
