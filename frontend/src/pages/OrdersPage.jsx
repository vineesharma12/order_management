import { useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';

import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/Modal.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { api } from '../lib/api.js';
import { formatDateTime, money } from '../lib/formatters.js';

function OrderModal({ products, customers, onClose, onCreated, setNotice }) {
  const [customerId, setCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const selectedProduct = products.find((product) => String(product.id) === String(productId));

  async function submit(event) {
    event.preventDefault();
    const nextQuantity = Number(quantity);
    if (!customerId) {
      setError('Select a customer.');
      return;
    }
    if (!productId) {
      setError('Select a product.');
      return;
    }
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }
    if (selectedProduct && nextQuantity > selectedProduct.stock) {
      setError(`Only ${selectedProduct.stock} units are available.`);
      return;
    }
    setError('');
    setSaving(true);
    try {
      await api('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer_id: Number(customerId),
          items: [{ product_id: Number(productId), quantity: nextQuantity }],
        }),
      });
      setNotice('Order placed and stock reduced.');
      onCreated();
      onClose();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Create order" onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <label>
          Customer
          <select required value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
            <option value="">Select customer</option>
            {customers.map((customer) => <option value={customer.id} key={customer.id}>{customer.name}</option>)}
          </select>
        </label>
        <label>
          Product
          <select required value={productId} onChange={(event) => setProductId(event.target.value)}>
            <option value="">Select product</option>
            {products.map((product) => <option value={product.id} key={product.id} disabled={product.stock === 0}>{product.name} ({product.stock} left)</option>)}
          </select>
        </label>
        <label>Quantity<input required min="1" max={selectedProduct?.stock || undefined} type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label>
        <div className="modal-actions">
          <button className="secondary" type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={saving}><ClipboardList size={16} aria-hidden="true" />Place order</button>
        </div>
      </form>
    </Modal>
  );
}

export function OrdersPage({ products, customers, orders, onCreated, setNotice }) {
  const [isOpen, setOpen] = useState(false);

  const columns = [
    { key: 'id', header: 'Order', render: (order) => `#${order.id}` },
    { key: 'customer_name', header: 'Customer' },
    { key: 'items', header: 'Items', render: (order) => order.items.map((item) => `${item.product_name} x ${item.quantity}`).join(', '), searchValue: (order) => order.items.map((item) => `${item.product_name} ${item.quantity}`) },
    { key: 'total_amount', header: 'Total', render: (order) => money.format(Number(order.total_amount)) },
    { key: 'created_at', header: 'Created', render: (order) => formatDateTime(order.created_at) },
  ];

  return (
    <>
      <PageHeader eyebrow="Sales" title="Orders" actionLabel="Create order" actionIcon={Plus} onAction={() => setOpen(true)} />
      <section className="panel">
        <DataTable columns={columns} rows={orders} emptyTitle="No data available" searchPlaceholder="Search orders by customer, items, total, or date..." />
      </section>
      {isOpen && <OrderModal products={products} customers={customers} onClose={() => setOpen(false)} onCreated={onCreated} setNotice={setNotice} />}
    </>
  );
}
