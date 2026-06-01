import { useState } from 'react';
import { Plus } from 'lucide-react';

import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/Modal.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { api } from '../lib/api.js';
import { money } from '../lib/formatters.js';

function ProductModal({ onClose, onCreated, setNotice }) {
  const [form, setForm] = useState({ name: '', sku: '', price: '', stock: '' });
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await api('/products', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          price: Number(form.price),
          stock: Number(form.stock),
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
        <label>Product name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>SKU<input required value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} /></label>
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
      <PageHeader eyebrow="Catalog" title="Products" actionLabel="Add product" actionIcon={Plus} onAction={() => setOpen(true)} />
      <section className="panel">
        <DataTable columns={columns} rows={products} emptyTitle="No products found." />
      </section>
      {isOpen && <ProductModal onClose={() => setOpen(false)} onCreated={onCreated} setNotice={setNotice} />}
    </>
  );
}
