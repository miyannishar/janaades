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
      <div className="page-header-inner">
        <div>
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>{label}</div>
          <h1 className="heading-xl">{title}</h1>
        </div>
        {(subtitle || meta) && (
          <div className="page-header-meta">
            {subtitle && <div style={{ fontWeight: 600 }}>{subtitle}</div>}
            {meta && <div>{meta}</div>}
          </div>
        )}
      </div>
    </header>
  )
}
