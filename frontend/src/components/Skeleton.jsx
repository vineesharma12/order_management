function SkeletonLine({ className = '' }) {
  return <span className={`skeleton-line ${className}`} aria-hidden="true" />;
}

function SkeletonPanel({ wide = false }) {
  return (
    <article className={`panel insight-panel skeleton-panel ${wide ? 'wide' : ''}`} aria-hidden="true">
      <div className="panel-title">
        <span className="skeleton-icon" />
        <div className="skeleton-title-stack">
          <SkeletonLine className="short" />
          <SkeletonLine className="medium" />
        </div>
      </div>
      <div className="skeleton-empty">
        <span className="skeleton-orb" />
        <SkeletonLine className="center short" />
        <SkeletonLine className="center medium" />
      </div>
    </article>
  );
}

export function DashboardSkeleton() {
  return (
    <>
      <div className="page-header skeleton-header" aria-hidden="true">
        <div>
          <SkeletonLine className="heading" />
          <SkeletonLine className="subheading" />
        </div>
      </div>
      <section className="dashboard-grid" aria-label="Loading dashboard">
        <SkeletonPanel />
        <SkeletonPanel />
        <SkeletonPanel wide />
      </section>
    </>
  );
}

export function TableSkeleton() {
  return (
    <>
      <div className="page-header skeleton-header" aria-hidden="true">
        <div>
          <SkeletonLine className="heading" />
          <SkeletonLine className="subheading" />
        </div>
        <SkeletonLine className="button" />
      </div>
      <section className="panel skeleton-table-panel" aria-label="Loading table">
        <div className="list-toolbar">
          <div className="skeleton-search" aria-hidden="true">
            <SkeletonLine className="search-line" />
          </div>
        </div>
        <div className="skeleton-table" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div className="skeleton-table-row" key={rowIndex}>
              {Array.from({ length: 5 }).map((__, columnIndex) => (
                <SkeletonLine className={columnIndex === 0 ? 'cell wide-cell' : 'cell'} key={columnIndex} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
