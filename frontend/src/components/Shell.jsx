import { useState } from 'react';
import { Boxes, CheckCircle2, Menu, Moon, Sun, X } from 'lucide-react';

import { navItems } from '../data/navigation.jsx';
import { DashboardSkeleton, TableSkeleton } from './Skeleton.jsx';

export function Shell({ activePage, setActivePage, children, notice, loading, theme, onToggleTheme }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function goTo(page) {
    setActivePage(page);
    setMobileNavOpen(false);
  }

  const loadingContent = activePage === 'dashboard' ? <DashboardSkeleton /> : <TableSkeleton />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <Boxes size={25} aria-hidden="true" />
          </div>
          <div>
            <strong>Invenza</strong>
            <span>Inventory Management</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button className={activePage === item.id ? 'active' : ''} type="button" key={item.id} onClick={() => goTo(item.id)}>
                <Icon size={19} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <span>v1.0.0</span>
          <span>Invenza - Assessment build</span>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button className="icon-button ghost mobile-menu" type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu" title="Open menu">
            <Menu size={20} aria-hidden="true" />
          </button>
          <strong className="topbar-title">{navItems.find((item) => item.id === activePage)?.label || 'Dashboard'}</strong>
          <button className="icon-button ghost" type="button" onClick={onToggleTheme} aria-label="Toggle theme" title="Toggle theme">
            {theme === 'dark' ? <Sun size={22} aria-hidden="true" /> : <Moon size={22} aria-hidden="true" />}
          </button>
        </header>
        {notice && (
          <div className="toast" role="status">
            <CheckCircle2 size={18} aria-hidden="true" />
            <span>{notice}</span>
            <X size={16} aria-hidden="true" />
          </div>
        )}
        <main className="page-main">
          {loading ? loadingContent : children}
        </main>
      </div>
      {mobileNavOpen && <button className="nav-scrim" type="button" aria-label="Close menu" onClick={() => setMobileNavOpen(false)} />}
    </div>
  );
}
