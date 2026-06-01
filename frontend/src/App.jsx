import { useEffect, useMemo, useState } from 'react';

import { Shell } from './components/Shell.jsx';
import { api } from './lib/api.js';
import { CustomersPage } from './pages/CustomersPage.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { OrdersPage } from './pages/OrdersPage.jsx';
import { ProductsPage } from './pages/ProductsPage.jsx';

export function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  const stats = useMemo(() => ({
    products: products.length,
    customers: customers.length,
    orders: orders.length,
    stock: products.reduce((total, product) => total + product.stock, 0),
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

  const page = {
    dashboard: <Dashboard stats={stats} />,
    products: <ProductsPage products={products} onCreated={loadAll} setNotice={setNotice} />,
    customers: <CustomersPage customers={customers} onCreated={loadAll} setNotice={setNotice} />,
    orders: <OrdersPage products={products} customers={customers} orders={orders} onCreated={loadAll} setNotice={setNotice} />,
  }[activePage];

  return (
    <Shell activePage={activePage} setActivePage={setActivePage} notice={notice} loading={loading} onRefresh={loadAll}>
      {page}
    </Shell>
  );
}
