import { useState } from 'react';
import { Plus } from 'lucide-react';

import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/Modal.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { api } from '../lib/api.js';
import { formatDateTime } from '../lib/formatters.js';

function CustomerModal({ onClose, onCreated, setNotice }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      setError('Customer name must be at least 2 characters.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (form.phone.trim() && form.phone.trim().length < 7) {
      setError('Phone number must be at least 7 characters.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await api('/customers', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        }),
      });
      setNotice('Customer created.');
      onCreated();
      onClose();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Add customer" onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <label>Customer name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
        <div className="modal-actions">
          <button className="secondary" type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={saving}><Plus size={16} aria-hidden="true" />Save</button>
        </div>
      </form>
    </Modal>
  );
}

export function CustomersPage({ customers, onCreated, setNotice }) {
  const [isOpen, setOpen] = useState(false);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone', render: (customer) => customer.phone || 'No phone' },
    { key: 'created_at', header: 'Created', render: (customer) => formatDateTime(customer.created_at) },
  ];

  return (
    <>
      <PageHeader eyebrow="People" title="Customers" actionLabel="Add customer" actionIcon={Plus} onAction={() => setOpen(true)} />
      <section className="panel">
        <DataTable columns={columns} rows={customers} emptyTitle="No data available" searchPlaceholder="Search customers by name, email, phone, or date..." />
      </section>
      {isOpen && <CustomerModal onClose={() => setOpen(false)} onCreated={onCreated} setNotice={setNotice} />}
    </>
  );
}
