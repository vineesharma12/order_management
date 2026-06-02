import { useState } from 'react';
import { Plus } from 'lucide-react';

import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/Modal.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { api } from '../lib/api.js';
import { money } from '../lib/formatters.js';

function ProductModal({ onClose, onCreated, setNotice }) {
  const [form, setForm] = useState({ name: '', sku: '', price: '', stock: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (form.name.trim().length < 2) {
      setError('Product name must be at least 2 characters.');
      return;
    }
    if (form.sku.trim().length < 2) {
      setError('SKU must be at least 2 characters.');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError('Price must be greater than zero.');
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setError('Stock must be a whole number of zero or more.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await api('/products', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name.trim(),
          sku: form.sku.trim(),
          price,
          stock,
        }),
      });
      setNotice('Product created.');
      onCreated();
      onClose();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Add product" onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <label>Product name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>SKU<input required value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value.toUpperCase() })} /></label>
        <label>Price<input required min="0.01" step="0.01" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
        <label>Stock<input required min="0" type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></label>
        <div className="modal-actions">
          <button className="secondary" type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={saving}><Plus size={16} aria-hidden="true" />Save</button>
        </div>
      </form>
    </Modal>
  );
}

export function ProductsPage({ products, onCreated, setNotice }) {
  const [isOpen, setOpen] = useState(false);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'sku', header: 'SKU' },
    { key: 'price', header: 'Price', render: (product) => money.format(Number(product.price)) },
    { key: 'stock', header: 'Stock', render: (product) => <span className={product.stock === 0 ? 'danger' : ''}>{product.stock}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (product) => (
        <span className={`pill ${product.stock === 0 ? 'red' : product.stock <= 5 ? 'amber' : 'green'}`}>
          {product.stock === 0 ? 'Out' : product.stock <= 5 ? 'Low' : 'Available'}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Products" description="Manage your product catalogue" actionLabel="New product" actionIcon={Plus} onAction={() => setOpen(true)} />
      <section className="panel">
        <DataTable
          columns={columns}
          rows={products}
          emptyTitle="No products found"
          emptyDescription="Try a different search or create your first product."
          emptyAction={<button type="button" onClick={() => setOpen(true)}><Plus size={17} aria-hidden="true" />Add product</button>}
          searchPlaceholder="Search by name or SKU..."
        />
      </section>
      {isOpen && <ProductModal onClose={() => setOpen(false)} onCreated={onCreated} setNotice={setNotice} />}
    </>
  );
}
