import { useEffect, useMemo, useState } from 'react';
import './PageStyles.css';

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
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    updateTheme(theme);
  }, [theme]);

  const bookings = useMemo(() => {
    if (!user) return [];
    const raw = getUserBookings(user);
    const now = new Date();
    return raw.map(booking => {
      const endDate = booking.endDate ? new Date(booking.endDate) : null;
      if (booking.status === 'Current' && endDate && endDate < now) {
        return { ...booking, status: 'Previous' };
      }
      return booking;
    });
  }, [user]);

  useEffect(() => {
    if (user) {
      const allBookings = getBookings();
      allBookings[user.email] = bookings;
      saveBookings(allBookings);
    }
  }, [user, bookings]);

  const currentBookings = bookings.filter(booking => booking.status === 'Current');
  const previousBookings = bookings.filter(booking => booking.status === 'Previous');

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
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
  };

  return (
    <section>
      <div className="page-panel">
        <h1>Member Access</h1>
        <p className="small-text">Sign up or log in to manage your tour plans and account bookings.</p>
      </div>
      {!user && (
        <div className="page-panel">
          <div className="auth-window">
            <div className={`auth-slider${view === 'signup' ? ' show-signup' : ''}`}>
              {/* Login Panel */}
              <div className="auth-panel">
                <h2>Login</h2>
                <p className="small-text">Welcome back. Enter your credentials to continue.</p>
                <form onSubmit={handleLogin}>
                  <div className="form-field">
                    <label htmlFor="login-name">Full Name</label>
                    <input
                      id="login-name"
                      value={loginName}
                      onChange={e => setLoginName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="login-email">Email Address</label>
                    <input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <button className="primary-btn full-width" type="submit">Log In</button>
                  <p className="small-text" style={{ marginTop: '16px', textAlign: 'center' }}>
                    New to I-RAH?{' '}
                    <button className="link-btn" type="button" onClick={() => setView('signup')}>Create an account</button>
                  </p>
                </form>
              </div>
              {/* Sign Up Panel */}
              <div className="auth-panel">
                <h2>Create Account</h2>
                <p className="small-text">Join I-RAH Tourism and start exploring the world.</p>
                <form onSubmit={handleSignup}>
                  <div className="form-field">
                    <label htmlFor="signup-name">Full Name</label>
                    <input
                      id="signup-name"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="signup-email">Email Address</label>
                    <input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                    />
                  </div>
                  <button className="primary-btn full-width" type="submit">Sign Up</button>
                  <p className="small-text" style={{ marginTop: '16px', textAlign: 'center' }}>
                    Already have an account?{' '}
                    <button className="link-btn" type="button" onClick={() => setView('login')}>Log in</button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {user && (
        <>
          <div className="page-panel">
            <h2>Welcome back</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button className="secondary-btn" type="button" onClick={logout}>Log out</button>
          </div>
          <div className="page-panel">
            <h2>Your bookings</h2>
            <div className="grid">
              <div className="card">
                <h3>Current bookings</h3>
                <ul>
                  {currentBookings.length > 0 ? currentBookings.map((booking, idx) => (
                    <li key={`current-${idx}`} style={{ marginBottom: '8px' }}>
                      {booking.plan} — {booking.totalLabel} — Items: {booking.items?.length ? booking.items.join(', ') : 'No food items'}
                    </li>
                  )) : <li>No current booking yet.</li>}
                </ul>
              </div>
              <div className="card">
                <h3>Previous bookings</h3>
                <ul>
                  {previousBookings.length > 0 ? previousBookings.map((booking, idx) => (
                    <li key={`previous-${idx}`} style={{ marginBottom: '8px' }}>
                      {booking.plan} — {booking.totalLabel} — Items: {booking.items?.length ? booking.items.join(', ') : 'No food items'}
                    </li>
                  )) : <li>No previous booking yet.</li>}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default AccountPage;
