import { Boxes, ClipboardList, ShoppingCart, UsersRound } from 'lucide-react';

import { PageHeader } from '../components/PageHeader.jsx';
import { Stat } from '../components/Stat.jsx';

export function Dashboard({ stats }) {
  return (
    <>
      <PageHeader eyebrow="Overview" title="Business dashboard" />
      <section className="stats">
        <Stat icon={Boxes} label="Products" value={stats.products} tone="green" />
        <Stat icon={UsersRound} label="Customers" value={stats.customers} tone="blue" />
        <Stat icon={ShoppingCart} label="Orders" value={stats.orders} tone="amber" />
        <Stat icon={ClipboardList} label="Stock units" value={stats.stock} tone="red" />
      </section>
    </>
  );
}
