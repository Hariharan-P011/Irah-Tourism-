import { useEffect, useState } from 'react';
import './PageStyles.css';

const getCurrentUser = () => {
  const storedUser = sessionStorage.getItem('irah_user');
  return storedUser ? JSON.parse(storedUser) : null;
};

const getFoodItemsKey = () => {
  const user = getCurrentUser();
  return user ? `irah_food_items_${user.email}` : 'irah_food_items_guest';
};

const readFoodItems = () => JSON.parse(localStorage.getItem(getFoodItemsKey()) || '[]');

const MenuPage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const currentUser = getCurrentUser();

  useEffect(() => {
    setFoodItems(readFoodItems());
  }, []);

  useEffect(() => {
    localStorage.setItem(getFoodItemsKey(), JSON.stringify(foodItems));
  }, [foodItems]);

  const addFoodItem = () => {
    const trimmed = foodName.trim();
    if (!trimmed) {
      alert('Please enter a food item!');
      return;
    }
    setFoodItems(prev => [...prev, trimmed]);
    setFoodName('');
  };

  const removeFoodItem = index => {
    setFoodItems(prev => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const imageSources = [
    'https://media.istockphoto.com/id/186087388/photo/thali-with-rice-and-vegetables-on-green-painted-wooden-table.jpg?s=612x612&w=0&k=20&c=XSo8ePZ8Iy3Y1JGPK68uEmMeTx9S6tkTFaqTbsBc-no=',
    'https://static.vecteezy.com/system/resources/thumbnails/046/673/859/small/delicious-tandoori-chicken-served-on-a-plate-free-photo.jpg'
  ];

  return (
    <section>
      <div className="page-panel">
        <h1>Food Menu</h1>
        <p className="small-text">Choose your food items here. These can be kept for the next booking or updated before payment.</p>
      </div>
      <div className="page-panel">
        <div className="form-field" style={{ alignItems: 'stretch' }}>
          <label htmlFor="foodInput">Add Food Item:</label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              id="foodInput"
              type="text"
              value={foodName}
              onChange={e => setFoodName(e.target.value)}
              placeholder="Enter food name"
              style={{ flex: '1 1 260px' }}
            />
            <button type="button" onClick={addFoodItem} className="primary-btn">
              Add
            </button>
          </div>
        </div>
        <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <h2>Menu Items</h2>
          {foodItems.length === 0 ? (
            <p className="small-text">No food items selected yet.</p>
          ) : (
            <div className="grid">
              {foodItems.map((item, index) => (
                <div key={`${item}-${index}`} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item}</span>
                  <button className="secondary-btn" type="button" onClick={() => removeFoodItem(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <img
          src={imageSources[imageIndex]}
          alt="Food"
          style={{ width: '100%', maxWidth: '700px', borderRadius: '16px', margin: '0 auto', display: 'block', boxShadow: 'var(--shadow)', cursor: 'pointer' }}
          onClick={() => setImageIndex(i => (i + 1) % imageSources.length)}
        />
        <p className="small-text" style={{ textAlign: 'center' }}>(Click image to change)</p>
        <div className="page-panel" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)' }}>
          <p>All rights are reserved to IRAH TOURISM.</p>
          <p>Further details contact 1234567890 or email: abc123@gmail.com</p>
        </div>
      </div>
      {!currentUser && (
        <div className="page-panel" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <p className="small-text">Log in on the account page to save items per user.</p>
        </div>
      )}
    </section>
  );
};

export default MenuPage;
