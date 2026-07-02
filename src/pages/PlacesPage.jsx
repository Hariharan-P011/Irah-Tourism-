import { Link } from 'react-router-dom';
import './PageStyles.css';

const places = [
  { title: 'SWITZERLAND', plan: 'Switzerland', price: '60K', dates: '29 June 2026 to 05 July 2026' },
  { title: 'MALDIVES', plan: 'Maldives', price: '40K', dates: '10 July 2026 to 17 July 2026' },
  { title: 'ICELAND', plan: 'Iceland', price: '75K', dates: '20 July 2026 to 27 July 2026' },
  { title: 'DELHI', plan: 'Delhi', price: '30K', dates: '01 August 2026 to 08 August 2026' },
  { title: 'JAMMU AND KASHMIR', plan: 'Jammu and Kashmir', price: '20K', dates: '12 August 2026 to 19 August 2026' },
  { title: 'GOA', plan: 'Goa', price: '40K', dates: '22 August 2026 to 29 August 2026' }
];

const PlacesPage = () => {
  const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('irah_user') || 'null') : null;

  return (
    <section>
      <div className="page-panel">
        <h1>AVAILABLE PACKAGE</h1>
        <p className="small-text">{user ? `Logged in as ${user.name}. You can proceed to book.` : 'Please log in from the account page before booking.'}</p>
      </div>
      <div className="page-panel">
        <h2>FOREIGN PLACES</h2>
        <div className="grid">
          {places.slice(0, 3).map(place => (
            <article key={place.plan} className="card">
              <h3>{place.title}</h3>
              <p>EVENTS: 6</p>
              <p>SPOTS: 4</p>
              <p>DATE: {place.dates}</p>
              <p>TIME: 08:00 AM to 06:00 PM</p>
              <p>PRICE: {place.price}</p>
              <Link className="secondary-btn" to={`/form?plan=${encodeURIComponent(place.plan)}`}>
                @ BOOK TICKET
              </Link>
            </article>
          ))}
        </div>
      </div>
      <div className="page-panel">
        <h2>INDIAN PLACES</h2>
        <div className="grid">
          {places.slice(3).map(place => (
            <article key={place.plan} className="card">
              <h3>{place.title}</h3>
              <p>EVENTS: 6</p>
              <p>SPOTS: 4</p>
              <p>DATE: {place.dates}</p>
              <p>TIME: 08:00 AM to 06:00 PM</p>
              <p>PRICE: {place.price}</p>
              <Link className="secondary-btn" to={`/form?plan=${encodeURIComponent(place.plan)}`}>
                @ BOOK TICKET
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlacesPage;
