import { useEffect, useMemo, useState } from 'react';

import { Shell } from './components/Shell.jsx';
import { api } from './lib/api.js';
import { CustomersPage } from './pages/CustomersPage.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { OrdersPage } from './pages/OrdersPage.jsx';
import { ProductsPage } from './pages/ProductsPage.jsx';

function getRevenueByMonth(orders) {
  const months = orders.reduce((groups, order) => {
    const date = new Date(order.created_at);
    const isValidDate = !Number.isNaN(date.getTime());
    const key = isValidDate ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : `order-${order.id}`;
    const label = isValidDate
      ? date.toLocaleString('en-IN', { month: 'short', year: '2-digit' })
      : `Order #${order.id}`;
    const current = groups.get(key) || { label, sortValue: isValidDate ? date.getTime() : order.id, value: 0 };
    current.value += Number(order.total_amount || 0);
    groups.set(key, current);
    return groups;
  }, new Map());

  return Array.from(months.values())
    .sort((left, right) => left.sortValue - right.sortValue)
    .map(({ label, value }) => ({ label, value }));
}

export function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [theme, setTheme] = useState(() => window.localStorage.getItem('theme') || 'dark');

  const stats = useMemo(() => ({
    products: products.length,
    customers: customers.length,
    orders: orders.length,
    stock: products.reduce((total, product) => total + product.stock, 0),
    revenue: orders.reduce((total, order) => total + Number(order.total_amount || 0), 0),
    lowStock: products.filter((product) => product.stock <= 5).length,
    stockBuckets: [
      { label: 'Available', value: products.filter((product) => product.stock > 5).length },
      { label: 'Low stock', value: products.filter((product) => product.stock > 0 && product.stock <= 5).length },
      { label: 'Out', value: products.filter((product) => product.stock === 0).length },
    ],
    revenueByMonth: getRevenueByMonth(orders),
    recentOrders: orders.slice(0, 5),
    lowStockProducts: products.filter((product) => product.stock <= 5).slice(0, 5),
    topStockedProducts: [...products].sort((left, right) => right.stock - left.stock).slice(0, 5),
  }), [products, customers, orders]);

  async function loadAll() {
    setLoading(true);
    try {
      const [nextProducts, nextCustomers, nextOrders] = await Promise.all([
        api('/products'),
        api('/customers'),
        api('/orders'),
      ]);
      setProducts(nextProducts);
      setCustomers(nextCustomers);
      setOrders(nextOrders);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setNotice(''), 3200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const page = {
    dashboard: <Dashboard stats={stats} />,
    products: <ProductsPage products={products} onCreated={loadAll} setNotice={setNotice} />,
    customers: <CustomersPage customers={customers} onCreated={loadAll} setNotice={setNotice} />,
    orders: <OrdersPage products={products} customers={customers} orders={orders} onCreated={loadAll} setNotice={setNotice} />,
  }[activePage];

  return (
    <Shell
      activePage={activePage}
      setActivePage={setActivePage}
      notice={notice}
      loading={loading}
      onRefresh={loadAll}
      theme={theme}
      onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
    >
      {page}
    </Shell>
  );
}
