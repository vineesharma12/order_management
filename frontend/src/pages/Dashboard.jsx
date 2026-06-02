import { Boxes, ChartNoAxesColumnIncreasing, PackageOpen, ScrollText } from 'lucide-react';

import { EmptyState } from '../components/EmptyState.jsx';
import { PageHeader } from '../components/PageHeader.jsx';

export function Dashboard({ stats }) {
  const hasProducts = stats.products > 0;
  const hasOrders = stats.orders > 0;

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of inventory and orders for your Invenza workspace" />
      <section className="dashboard-grid">
        <article className="panel insight-panel">
          <div className="panel-title">
            <span className="title-icon teal"><Boxes size={19} aria-hidden="true" /></span>
            <div>
              <h2>Stock health</h2>
              <p>Distribution of stock levels</p>
            </div>
          </div>
          {!hasProducts && <EmptyState title="No products yet" description="Add products to see stock distribution." />}
          {hasProducts && <div className="metric-hero"><strong>{stats.stock}</strong><span>Total units in stock</span></div>}
        </article>
        <article className="panel insight-panel">
          <div className="panel-title">
            <span className="title-icon purple"><ChartNoAxesColumnIncreasing size={19} aria-hidden="true" /></span>
            <div>
              <h2>Orders by status</h2>
              <p>Distribution across the order pipeline</p>
            </div>
          </div>
          {!hasOrders && <EmptyState title="No orders yet" description="Create your first order to see the breakdown." />}
          {hasOrders && <div className="metric-hero"><strong>{stats.orders}</strong><span>Total orders created</span></div>}
        </article>
        <article className="panel insight-panel wide">
          <div className="panel-title">
            <span className="title-icon orange"><PackageOpen size={19} aria-hidden="true" /></span>
            <div>
              <h2>Top stocked products</h2>
              <p>Highest inventory levels</p>
            </div>
          </div>
          {stats.topStockedProducts.length === 0 && <EmptyState icon={ScrollText} title="No products yet" description="Inventory rankings will appear when products are added." />}
          {stats.topStockedProducts.length > 0 && (
            <div className="activity-list">
              {stats.topStockedProducts.map((product) => (
                <div className="activity-row" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.sku}</span>
                  </div>
                  <b>{product.stock} units</b>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </>
  );
}
