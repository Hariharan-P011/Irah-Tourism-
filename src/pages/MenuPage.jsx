import { useEffect, useState } from 'react';
import './PageStyles.css';

const getCurrentUser = () => {
  try { return JSON.parse(sessionStorage.getItem('irah_user')); } catch { return null; }
};

const getListKey = user => user ? `irah_food_items_${user.email}` : null;

const MenuPage = () => {
  const currentUser = getCurrentUser();
  const listKey = getListKey(currentUser);

  const [savedList, setSavedList] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!listKey) return;
    try { setSavedList(JSON.parse(localStorage.getItem(listKey)) || []); } catch { setSavedList([]); }
  }, [listKey]);

  const persist = items => {
    setSavedList(items);
    if (listKey) localStorage.setItem(listKey, JSON.stringify(items));
  };

  const addItem = () => {
    const val = input.trim();
    if (!val) return;
    if (savedList.includes(val)) { alert('Item already in your list.'); return; }
    persist([...savedList, val]);
    setInput('');
  };

  const removeItem = idx => persist(savedList.filter((_, i) => i !== idx));

  const handleKey = e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } };

  if (!currentUser) {
    return (
      <section>
        <div className="page-panel">
          <h1>Preferred Items</h1>
          <p className="small-text">Please log in from the Account page to manage your preferred item list.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="page-panel">
        <h1>Preferred Items</h1>
        <p className="small-text">
          Manage your preferred food &amp; item list. This list is saved to your account and will be
          carried into your booking. You can update it here at any time or edit it again just before confirming a package.
        </p>
      </div>

      <div className="page-panel">
        <h2>Your Saved List</h2>
        {savedList.length === 0 ? (
          <p className="small-text">No items saved yet. Add items below to build your preferred list.</p>
        ) : (
          <ul className="item-list">
            {savedList.map((item, idx) => (
              <li key={idx} className="item-row">
                <span>{item}</span>
                <button className="secondary-btn" type="button" onClick={() => removeItem(idx)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="page-panel">
        <h2>Add an Item</h2>
        <div className="form-field">
          <label htmlFor="itemInput">Item Name</label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              id="itemInput"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g. Vegetarian Meal, Snack Pack"
              style={{ flex: '1 1 260px' }}
            />
            <button type="button" onClick={addItem} className="primary-btn">Add to List</button>
          </div>
        </div>
        <p className="small-text">
          Your list is automatically applied when you proceed to book a package from the Places page.
          You can also edit it directly on the booking form before confirming.
        </p>
      </div>
    </section>
  );
};

export default MenuPage;
