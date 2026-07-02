import './PageStyles.css';

const HomePage = () => {
  return (
    <section className="page-panel">
      <h1>I-RAH TOURISM</h1>
      <p className="small-text">(Explore - Experience - Embrace the unknown)</p>
      <div className="page-panel" style={{ background: 'rgba(255,255,255,0.04)', padding: '24px' }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/1280px-24701-nature-natural-beauty.jpg"
          alt="Travel scenery"
          style={{ width: '100%', borderRadius: '20px', maxHeight: '420px', objectFit: 'cover' }}
        />
        <p style={{ marginTop: '24px', fontSize: '1.05rem', color: 'var(--text)' }}>
          Tourism plays a vital role in economic and social development. It generates revenue, creates jobs,
          and supports local businesses, contributing significantly to national economies. Beyond financial
          benefits, tourism promotes cultural exchange, fostering understanding and appreciation of diverse
          traditions and lifestyles. It encourages the preservation of cultural heritage and natural
          environments, often driving efforts in conservation. Tourism improves infrastructure, enhances
          community development, and supports global connectivity. It also provides opportunities for
          personal growth, education, and recreation, enriching travelers' experiences. By bridging gaps
          between people and cultures, tourism strengthens relationships, promotes peace, and builds a more
          interconnected and inclusive global community. So in moto of service we started this I-RAH tourism website.
        </p>
      </div>
      <div className="page-panel" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <p style={{ margin: 0, textAlign: 'center', color: 'var(--muted)' }}>
          TO KNOW FURTHER INFORMATION,
          <br />
          CONTACT: 1234567890 (or) E.MAIL: abc.123@gmail.com
        </p>
      </div>
    </section>
  );
};

export default HomePage;
