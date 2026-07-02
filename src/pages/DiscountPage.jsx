import { useEffect, useMemo, useState } from 'react';
import './PageStyles.css';

const DiscountPage = () => {
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState('Guess the correct number to get your discount!');
  const [discount, setDiscount] = useState(0);
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [score, setScore] = useState(20);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('irah_discount') || '0', 10);
    setDiscount(stored);
  }, []);

  const parseIntValue = value => parseInt(value, 10);

  const handleCheck = () => {
    const guessNumber = parseIntValue(guess);
    if (guessNumber !== target) {
      const nextScore = Math.max(0, score - 2);
      setScore(nextScore);
      setResult("You're wrong! Try again.");
      setDiscount(nextScore);
      localStorage.setItem('irah_discount', nextScore);
      return;
    }
    setResult("You're right! 🎉");
    localStorage.setItem('irah_discount', score);
    setDiscount(score);
  };

  return (
    <section>
      <div className="page-panel">
        <h1>GET YOUR DISCOUNT!!</h1>
        <p className="small-text">Before payment, check the discount code.</p>
      </div>
      <div className="page-panel">
        <div className="form-field">
          <label htmlFor="guess">ENTER A NUMBER BETWEEN 1 TO 10:</label>
          <input
            id="guess"
            type="number"
            min="1"
            max="10"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            placeholder="Enter number"
          />
        </div>
        <button className="primary-btn" type="button" onClick={handleCheck}>
          Check
        </button>
        <div className="page-panel" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <p id="result" style={{ margin: 0 }}>{result}</p>
          <p id="discount" style={{ margin: 0 }}><strong>Your Discount = {discount}%</strong></p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <a className="secondary-btn" href="/form">Continue to payment</a>
        </div>
      </div>
    </section>
  );
};

export default DiscountPage;
