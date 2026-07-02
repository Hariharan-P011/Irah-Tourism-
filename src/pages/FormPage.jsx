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

const STORAGE_KEYS = {
  user: 'irah_user',
  bookings: 'irah_bookings'
};

const parseStoredJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getCurrentUser = () => parseStoredJson(sessionStorage.getItem(STORAGE_KEYS.user), null);
const getBookings = () => parseStoredJson(localStorage.getItem(STORAGE_KEYS.bookings), {});
const saveBookings = bookings => localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
const getUserBookings = user => {
  const bookings = getBookings();
  return Array.isArray(bookings?.[user?.email]) ? bookings[user.email] : [];
};

const getFoodItemsKey = () => {
  const user = getCurrentUser();
  return user ? `irah_food_items_${user.email}` : 'irah_food_items_guest';
};

const FormPage = () => {
  const [params] = useSearchParams();
  const [name, setName] = useState('');
  const [tickets, setTickets] = useState('');
  const [contact, setContact] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [items, setItems] = useState([]);

  const plan = params.get('plan') || 'Switzerland';

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setName(user.name);
    }
    setItems(parseStoredJson(localStorage.getItem(getFoodItemsKey()), []));
  }, [plan]);

  const basePrice = useMemo(() => planPrices[plan] * (parseInt(tickets, 10) || 0), [plan, tickets]);
  const discountFromCode = discountCode.trim().toUpperCase() === 'SAVE20' ? basePrice * 0.2 : 0;
  const storedDiscountPercent = parseInt(localStorage.getItem('irah_discount') || '0', 10);
  const discount = Math.max(discountFromCode, (storedDiscountPercent / 100) * basePrice);
  const total = Math.max(0, basePrice - discount);

  const handleSubmit = event => {
    event.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Enter your name.';
    if (!tickets.trim() || Number.isNaN(Number(tickets)) || Number(tickets) <= 0) newErrors.tickets = 'Enter a valid ticket count.';
    if (!contact.trim()) newErrors.contact = 'Enter your contact number.';
    if (!currentUser) newErrors.user = 'Please log in first.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const userBookings = getUserBookings(currentUser).map(booking => {
      const now = new Date();
      const endDate = booking.endDate ? new Date(booking.endDate) : null;
      if (booking.status === 'Current' && endDate && endDate < now) {
        return { ...booking, status: 'Previous' };
      }
      return booking;
    });

    const bookingEnd = new Date();
    bookingEnd.setDate(bookingEnd.getDate() + 7);
    const updatedBookings = [
      {
        plan,
        name,
        tickets,
        totalLabel: `${total.toLocaleString()} INR`,
        status: 'Current',
        items,
        endDate: bookingEnd.toISOString()
      },
      ...userBookings
    ];

    const allBookings = getBookings();
    allBookings[currentUser.email] = updatedBookings;
    saveBookings(allBookings);

    alert(`Booking confirmed for ${plan}! Total to pay: ${total.toLocaleString()} INR`);
    window.location.href = '/account';
  };

  return (
    <section>
      <div className="page-panel">
        <h1>BOOK YOUR TOUR</h1>
      </div>
      <div className="page-panel">
        {currentUser ? (
          <p className="small-text">Logged in as {currentUser.name}. You can book now.</p>
        ) : (
          <p className="small-text">Please log in at account page before booking.</p>
        )}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3>Selected items</h3>
          <p>Your item list is saved automatically for this trip.</p>
          <ul>
            {items.length > 0 ? items.map((item, idx) => <li key={idx}>{item}</li>) : <li>No items selected yet.</li>}
          </ul>
          <a className="secondary-btn" href="/menu?return=form">Edit items</a>
        </div>
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3>Discount step</h3>
          <p>If no code is entered, open the discount page and use the final discount result before payment.</p>
          <a className="secondary-btn" href="/discount">Open discount page</a>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>SELECT PLAN:</label>
            <select value={plan} disabled>
              <option value={plan}>{plan}</option>
            </select>
          </div>
          <div className="form-field">
            <label>ENTER YOUR NAME:</label>
            <input value={name} onChange={e => setName(e.target.value)} />
            {errors.name && <span className="small-text" style={{ color: '#ff6b6b' }}>{errors.name}</span>}
          </div>
          <div className="form-field">
            <label>ENTER NUMBER OF TICKETS:</label>
            <input type="number" value={tickets} onChange={e => setTickets(e.target.value)} />
            {errors.tickets && <span className="small-text" style={{ color: '#ff6b6b' }}>{errors.tickets}</span>}
          </div>
          <div className="form-field">
            <label>ENTER YOUR CONTACT NUMBER:</label>
            <input type="tel" value={contact} onChange={e => setContact(e.target.value)} />
            {errors.contact && <span className="small-text" style={{ color: '#ff6b6b' }}>{errors.contact}</span>}
          </div>
          <div className="form-field">
            <label>DISCOUNT CODE:</label>
            <input value={discountCode} onChange={e => setDiscountCode(e.target.value)} placeholder="Try SAVE20" />
          </div>
          <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p>Base price: {basePrice.toLocaleString()} INR</p>
            <p>Discount: {discount.toLocaleString()} INR</p>
            <p><strong>Total: {total.toLocaleString()} INR</strong></p>
          </div>
          {errors.user && <span className="small-text" style={{ color: '#ff6b6b' }}>{errors.user}</span>}
          <button className="primary-btn full-width" type="submit">PAY AND BOOK</button>
        </form>
      </div>
    </section>
  );
};

export default FormPage;
