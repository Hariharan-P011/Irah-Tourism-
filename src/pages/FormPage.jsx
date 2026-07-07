import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './PageStyles.css';

const planPrices = {
  Switzerland: 60000,
  Maldives: 40000,
  Iceland: 75000,
  Delhi: 30000,
  'Jammu and Kashmir': 20000,
  Goa: 40000
};

const STORAGE_KEYS = { user: 'irah_user', bookings: 'irah_bookings' };

const parseJson = (val, fallback) => { try { return val ? JSON.parse(val) : fallback; } catch { return fallback; } };
const getCurrentUser = () => parseJson(sessionStorage.getItem(STORAGE_KEYS.user), null);
const getBookings = () => parseJson(localStorage.getItem(STORAGE_KEYS.bookings), {});
const saveBookings = b => localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(b));
const getUserBookings = user => { const b = getBookings(); return Array.isArray(b?.[user?.email]) ? b[user.email] : []; };
const getFoodKey = user => user ? `irah_food_items_${user.email}` : null;

const FormPage = () => {
  const [params] = useSearchParams();
  const plan = params.get('plan') || 'Switzerland';

  const [name, setName] = useState('');
  const [tickets, setTickets] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setName(user.name);
      const key = getFoodKey(user);
      setItems(parseJson(key ? localStorage.getItem(key) : null, []));
    }
  }, [plan]);

  const total = useMemo(() => planPrices[plan] * (parseInt(tickets, 10) || 0), [plan, tickets]);

  const addItem = () => {
    const val = newItem.trim();
    if (!val) return;
    setItems(prev => prev.includes(val) ? prev : [...prev, val]);
    setNewItem('');
  };

  const removeItem = idx => setItems(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = e => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Enter your name.';
    if (!tickets || Number(tickets) <= 0) errs.tickets = 'Enter a valid ticket count.';
    if (!contact.trim()) errs.contact = 'Enter your contact number.';
    if (!currentUser) errs.user = 'Please log in first.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const now = new Date();
    const existing = getUserBookings(currentUser).map(b => {
      const end = b.endDate ? new Date(b.endDate) : null;
      return b.status === 'Current' && end && end < now ? { ...b, status: 'Previous' } : b;
    });

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const allBookings = getBookings();
    allBookings[currentUser.email] = [
      { plan, name, tickets, totalLabel: `${total.toLocaleString()} INR`, status: 'Current', items, endDate: endDate.toISOString() },
      ...existing
    ];
    saveBookings(allBookings);

    // persist updated item list back to preferred list
    const key = getFoodKey(currentUser);
    if (key) localStorage.setItem(key, JSON.stringify(items));

    alert(`Booking confirmed for ${plan}! Total: ${total.toLocaleString()} INR`);
    window.location.href = '/account';
  };

  return (
    <section>
      <div className="page-panel">
        <h1>Book Your Tour</h1>
        {currentUser
          ? <p className="small-text">Logged in as <strong>{currentUser.name}</strong>. Complete the form below to confirm your booking.</p>
          : <p className="small-text" style={{ color: '#c0392b' }}>You must be logged in to book. Please visit the Account page first.</p>
        }
      </div>

      <div className="page-panel">
        <h2>Selected Items for This Trip</h2>
        <p className="small-text">Your preferred list has been loaded. You can add or remove items before confirming.</p>
        {items.length > 0 ? (
          <ul className="item-list">
            {items.map((item, idx) => (
              <li key={idx} className="item-row">
                <span>{item}</span>
                <button className="secondary-btn" type="button" onClick={() => removeItem(idx)}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="small-text">No items selected. Add items below or manage your list from the Items page.</p>
        )}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
            placeholder="Add an item for this booking"
            style={{ flex: '1 1 240px' }}
          />
          <button type="button" className="primary-btn" onClick={addItem}>Add Item</button>
        </div>
      </div>

      <div className="page-panel">
        <h2>Booking Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Selected Package</label>
            <select value={plan} disabled><option value={plan}>{plan}</option></select>
          </div>
          <div className="form-field">
            <label>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
            {errors.name && <span className="small-text" style={{ color: '#c0392b' }}>{errors.name}</span>}
          </div>
          <div className="form-field">
            <label>Number of Tickets</label>
            <input type="number" min="1" value={tickets} onChange={e => setTickets(e.target.value)} placeholder="e.g. 2" />
            {errors.tickets && <span className="small-text" style={{ color: '#c0392b' }}>{errors.tickets}</span>}
          </div>
          <div className="form-field">
            <label>Contact Number</label>
            <input type="tel" value={contact} onChange={e => setContact(e.target.value)} placeholder="Your phone number" />
            {errors.contact && <span className="small-text" style={{ color: '#c0392b' }}>{errors.contact}</span>}
          </div>

          <div className="card" style={{ marginBottom: '24px' }}>
            <p style={{ margin: '0 0 4px' }}>Package: <strong>{plan}</strong></p>
            <p style={{ margin: '0 0 4px' }}>Tickets: <strong>{parseInt(tickets, 10) || 0}</strong></p>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>Total Payable: <strong>{total.toLocaleString()} INR</strong></p>
          </div>

          {errors.user && <p className="small-text" style={{ color: '#c0392b', marginBottom: '12px' }}>{errors.user}</p>}
          <button className="primary-btn full-width" type="submit">Confirm &amp; Pay</button>
        </form>
      </div>
    </section>
  );
};

export default FormPage;
