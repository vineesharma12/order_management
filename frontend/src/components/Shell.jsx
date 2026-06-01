import { useState } from 'react';
import { Menu, RefreshCw, Search } from 'lucide-react';

import { navItems } from '../data/navigation.jsx';

export function Shell({ activePage, setActivePage, children, notice, loading, onRefresh }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function goTo(page) {
    setActivePage(page);
    setMobileNavOpen(false);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">IO</div>
          <div>
            <strong>OrderDesk</strong>
            <span>Management</span>
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
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button className="icon-button ghost mobile-menu" type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu" title="Open menu">
            <Menu size={20} aria-hidden="true" />
          </button>
          <div className="search-box">
            <Search size={17} aria-hidden="true" />
            <span>Inventory and order operations</span>
          </div>
          <button className="icon-button ghost" type="button" onClick={onRefresh} aria-label="Refresh data" title="Refresh data">
            <RefreshCw size={20} aria-hidden="true" />
          </button>
        </header>
        {notice && <div className="notice" role="status">{notice}</div>}
        <main className="page-main">
          {loading ? <div className="loading">Loading application data...</div> : children}
        </main>
      </div>
      {mobileNavOpen && <button className="nav-scrim" type="button" aria-label="Close menu" onClick={() => setMobileNavOpen(false)} />}
    </div>
  );
}
