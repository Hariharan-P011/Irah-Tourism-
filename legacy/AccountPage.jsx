import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEYS = {
  user: 'irah_user',
  theme: 'irah_theme',
  accounts: 'irah_accounts',
  bookings: 'irah_bookings'
};

const parseStoredJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getAccounts = () => parseStoredJson(localStorage.getItem(STORAGE_KEYS.accounts), []);
const saveAccounts = accounts => localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));

const getBookings = () => parseStoredJson(localStorage.getItem(STORAGE_KEYS.bookings), {});
const saveBookings = bookings => localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));

const getCurrentUser = () => parseStoredJson(sessionStorage.getItem(STORAGE_KEYS.user), null);
const saveCurrentUser = user => sessionStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
const clearCurrentUser = () => sessionStorage.removeItem(STORAGE_KEYS.user);

const getUserBookings = user => {
  const bookings = getBookings();
  return Array.isArray(bookings?.[user?.email]) ? bookings[user.email] : [];
};

const updateTheme = theme => {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEYS.theme, theme);
};

const AccountPage = () => {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
    setTheme(savedTheme);
    const storedUser = getCurrentUser();
    setUser(storedUser);
  }, []);

  useEffect(() => {
    updateTheme(theme);
  }, [theme]);

  const bookings = useMemo(() => {
    if (!user) return [];
    const raw = getUserBookings(user);
    return raw.map(booking => {
      const endDate = booking.endDate ? new Date(booking.endDate) : null;
      if (booking.status === 'Current' && endDate && endDate < new Date()) {
        return { ...booking, status: 'Previous' };
      }
      return booking;
    });
  }, [user]);

  useEffect(() => {
    if (user) {
      const adjustedBookings = bookings;
      const allBookings = getBookings();
      allBookings[user.email] = adjustedBookings;
      saveBookings(allBookings);
    }
  }, [user, bookings]);

  const currentBookings = useMemo(
    () => bookings.filter(booking => booking.status === 'Current'),
    [bookings]
  );

  const previousBookings = useMemo(
    () => bookings.filter(booking => booking.status === 'Previous'),
    [bookings]
  );

  const handleSignup = event => {
    event.preventDefault();
    const name = signupName.trim();
    const email = signupEmail.trim().toLowerCase();
    if (!name || !email) {
      alert('Please enter your name and email.');
      return;
    }
    const accounts = getAccounts();
    if (accounts.some(account => account.email.toLowerCase() === email)) {
      alert('This email is already signed up. Please log in.');
      return;
    }
    accounts.push({ name, email });
    saveAccounts(accounts);
    setSignupName('');
    setSignupEmail('');
    setView('login');
    alert('Account created successfully. Please log in now.');
  };

  const handleLogin = event => {
    event.preventDefault();
    const name = loginName.trim();
    const email = loginEmail.trim().toLowerCase();
    if (!name || !email) {
      alert('Please enter your name and email.');
      return;
    }
    const accounts = getAccounts();
    const matchedAccount = accounts.find(
      account => account.email.toLowerCase() === email && account.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (!matchedAccount) {
      alert('Account not found. Please sign up first.');
      return;
    }
    const loggedInUser = { name: matchedAccount.name, email: matchedAccount.email };
    saveCurrentUser(loggedInUser);
    setUser(loggedInUser);
    setLoginName('');
    setLoginEmail('');
    const params = new URLSearchParams(window.location.search);
    if (params.get('next') === 'places') {
      window.location.href = 'places.html';
    }
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
  };

  return (
    <>
      <style>{`
        :root {
          color-scheme: dark;
          --bg: #0f0b18;
          --surface: #171224;
          --text: #f8f4ff;
          --muted: #d9c7ff;
          --accent: #a855f7;
          --accent-strong: #7c3aed;
          --border: rgba(168, 85, 247, 0.35);
          --shadow: 0 14px 34px rgba(0, 0, 0, 0.25);
        }
        body[data-theme="light"] {
          color-scheme: light;
          --bg: #f7f1ff;
          --surface: #ffffff;
          --text: #1f132f;
          --muted: #5f4a7e;
          --accent: #7c3aed;
          --accent-strong: #5b21b6;
          --border: rgba(124, 58, 237, 0.35);
          --shadow: 0 12px 28px rgba(124, 58, 237, 0.12);
        }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
        nav { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding: 14px 24px; background: rgba(0, 0, 0, 0.24); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 10; }
        nav div { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
        nav a { color: var(--text); text-decoration: none; font-weight: 700; margin: 0 10px; opacity: 0.95; }
        nav a:hover { opacity: 1; }
        #theme-toggle { border: 1px solid rgba(255,255,255,0.18); border-radius: 999px; padding: 10px 14px; cursor: pointer; background: rgba(255,255,255,0.04); color: var(--surface); font-weight: 700; }
        main { width: min(100% - 32px, 1080px); max-width: 1080px; margin: 32px auto; padding: 0 16px 40px; }
        .panel { background: rgba(20, 8, 38, 0.92); border: 1px solid rgba(134, 80, 255, 0.22); border-radius: 24px; padding: 32px; box-shadow: 0 28px 60px rgba(0, 0, 0, 0.35); margin-bottom: 24px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .card { padding: 28px; border: 1px solid rgba(255, 22, 84, 0.22); border-radius: 24px; background: rgba(10, 4, 26, 0.95); box-shadow: 0 20px 40px rgba(255, 22, 84, 0.12); }
        .muted { color: rgba(255,255,255,0.68); }
        label { display: block; margin-bottom: 8px; color: rgba(255,255,255,0.82); font-size: 0.94rem; text-transform: uppercase; letter-spacing: 0.08em; }
        .auth-card { min-height: 360px; display: flex; flex-direction: column; justify-content: space-between; }
        .form-section { display: none; }
        .form-section.active { display: block; }
        .toggle-link { color: #ff5d86; font-weight: 700; border: none; background: transparent; cursor: pointer; text-decoration: underline; padding: 0; margin-left: 4px; }
        .form-footer { margin-top: 18px; color: rgba(255,255,255,0.72); font-size: 0.95rem; }
        form input { width: 100%; padding: 14px 16px; margin-bottom: 16px; border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 16px; background: rgba(255,255,255,0.06); color: var(--text); font-size: 1rem; outline: none; }
        form input::placeholder { color: var(--muted); }
        button { cursor: pointer; }
        .primary-btn { width: 100%; background: linear-gradient(90deg, #7c3aed, #a855f7); color: #f8f4ff; border: none; padding: 14px 18px; border-radius: 16px; font-weight: 700; font-size: 1rem; box-shadow: 0 18px 28px rgba(124, 58, 237, 0.32); }
        .secondary-btn { background: transparent; color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.55); padding: 12px 18px; border-radius: 16px; font-weight: 700; width: 100%; margin-top: 18px; }
        h1, h2 { color: #f8f4ff; }
        h2 { margin-bottom: 24px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
        .auth-header { margin-bottom: 20px; }
        .auth-header h1 { margin: 0 0 10px; font-size: 2.2rem; }
        .auth-header p { margin: 0; color: rgba(255,255,255,0.72); }
        @media (max-width: 900px) {
          .grid { grid-template-columns: 1fr; }
          nav { justify-content: center; gap: 10px; }
          nav a { margin: 6px 8px; }
          #theme-toggle { width: 100%; max-width: 180px; }
        }
      `}</style>

      <nav>
        <div>
          <a href="index.html">HOME</a>
          <a href="places.html">PLACES</a>
          <a href="menu.html">ITEMS</a>
          <a href="account.html">ACCOUNT</a>
          <a href="about.html">ABOUT US</a>
        </div>
        <button id="theme-toggle" type="button" onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </nav>

      <main>
        <section className="panel">
          <div className="auth-header">
            <h1>Member Access</h1>
            <p>Sign up or log in to manage your tour plans and account bookings.</p>
          </div>
        </section>

        <section className="panel" id="auth-panel" style={{ display: user ? 'none' : 'block' }}>
          <div className="grid">
            <div className="card auth-card">
              <div className={`form-section ${view === 'signup' ? 'active' : ''}`}>
                <h2>Sign up</h2>
                <form onSubmit={handleSignup}>
                  <label htmlFor="signup-name">Name</label>
                  <input
                    id="signup-name"
                    type="text"
                    value={signupName}
                    onChange={e => setSignupName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                  <label htmlFor="signup-email">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                  />
                  <button className="primary-btn" type="submit">Sign up</button>
                </form>
                <div className="form-footer">
                  Already have an account?
                  <button className="toggle-link" type="button" onClick={() => setView('login')}>Log in</button>
                </div>
              </div>
            </div>

            <div className="card auth-card">
              <div className={`form-section ${view === 'login' ? 'active' : ''}`}>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                  <label htmlFor="login-name">Name</label>
                  <input
                    id="login-name"
                    type="text"
                    value={loginName}
                    onChange={e => setLoginName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                  <label htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <button className="primary-btn" type="submit">Log in</button>
                </form>
                <div className="form-footer">
                  New user?
                  <button className="toggle-link" type="button" onClick={() => setView('signup')}>Register</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel" id="account-view" style={{ display: user ? 'block' : 'none' }}>
          <h2>Welcome back</h2>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <button className="secondary-btn" id="logout-btn" type="button" onClick={logout}>Log out</button>
        </section>

        <section className="panel" id="bookings-panel" style={{ display: user ? 'block' : 'none' }}>
          <h2>Your bookings</h2>
          <div className="grid">
            <div className="card">
              <h3>Current bookings</h3>
              <ul>
                {currentBookings.length > 0 ? (
                  currentBookings.map((booking, index) => (
                    <li key={`current-${index}`}>
                      {booking.plan} — {booking.totalLabel} — Items: {booking.items?.length ? booking.items.join(', ') : 'No food items'}
                    </li>
                  ))
                ) : (
                  <li>No current booking yet.</li>
                )}
              </ul>
            </div>
            <div className="card">
              <h3>Previous bookings</h3>
              <ul>
                {previousBookings.length > 0 ? (
                  previousBookings.map((booking, index) => (
                    <li key={`previous-${index}`}>
                      {booking.plan} — {booking.totalLabel} — Items: {booking.items?.length ? booking.items.join(', ') : 'No food items'}
                    </li>
                  ))
                ) : (
                  <li>No previous booking yet.</li>
                )}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AccountPage;
