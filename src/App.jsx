import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PlacesPage from './pages/PlacesPage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import FormPage from './pages/FormPage.jsx';
import DetailsPage from './pages/DetailsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="brand">I-RAH TOURISM</div>
          <nav className="app-nav">
            <NavLink to="/" end>HOME</NavLink>
            <NavLink to="/places">PLACES</NavLink>
            <NavLink to="/menu">ITEMS</NavLink>
            <NavLink to="/account">ACCOUNT</NavLink>
            <NavLink to="/about">ABOUT US</NavLink>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/places" element={<PlacesPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/details" element={<DetailsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
