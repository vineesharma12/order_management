import { AlertTriangle, Boxes, ClipboardList, IndianRupee, ShoppingCart, UsersRound } from 'lucide-react';

import { PageHeader } from '../components/PageHeader.jsx';
import { Stat } from '../components/Stat.jsx';
import { formatDateTime, money } from '../lib/formatters.js';

export function Dashboard({ stats }) {
  return (
    <>
      <PageHeader eyebrow="Overview" title="Business dashboard" />
      <section className="stats">
        <Stat icon={Boxes} label="Products" value={stats.products} tone="green" />
        <Stat icon={UsersRound} label="Customers" value={stats.customers} tone="blue" />
        <Stat icon={ShoppingCart} label="Orders" value={stats.orders} tone="amber" />
        <Stat icon={IndianRupee} label="Revenue" value={money.format(stats.revenue)} tone="violet" />
      </section>
      <section className="dashboard-grid">
        <article className="panel insight-panel">
          <div className="panel-title">
            <ClipboardList size={20} aria-hidden="true" />
            <h2>Recent orders</h2>
          </div>
          <div className="activity-list">
            {stats.recentOrders.length === 0 && <p className="muted">No orders have been created yet.</p>}
            {stats.recentOrders.map((order) => (
              <div className="activity-row" key={order.id}>
                <div>
                  <strong>#{order.id} - {order.customer_name}</strong>
                  <span>{formatDateTime(order.created_at)}</span>
                </div>
                <b>{money.format(Number(order.total_amount))}</b>
              </div>
            ))}
          </div>
        </article>
        <article className="panel insight-panel">
          <div className="panel-title">
            <AlertTriangle size={20} aria-hidden="true" />
            <h2>Inventory watch</h2>
          </div>
          <div className="inventory-summary">
            <div>
              <span>Total stock</span>
              <strong>{stats.stock}</strong>
            </div>
            <div>
              <span>Low stock SKUs</span>
              <strong>{stats.lowStock}</strong>
            </div>
          </div>
          <div className="activity-list compact">
            {stats.lowStockProducts.length === 0 && <p className="muted">All products are comfortably stocked.</p>}
            {stats.lowStockProducts.map((product) => (
              <div className="activity-row" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.sku}</span>
                </div>
                <b className={product.stock === 0 ? 'danger' : 'warning'}>{product.stock} left</b>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
