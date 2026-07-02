import './PageStyles.css';

const AboutPage = () => {
  return (
    <section>
      <div className="page-panel">
        <h1>ABOUT US</h1>
        <p className="small-text">Our motto is to show the unseen.</p>
      </div>
      <div className="grid">
        <div className="card" style={{ minHeight: '420px' }}>
          <iframe
            width="100%"
            height="240"
            src="https://www.youtube.com/embed/XhCkptbe7Z4?si=goLxf_SxuwEFdl27"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ borderRadius: '16px' }}
          />
          <div style={{ marginTop: '16px' }}>
            <p className="small-text">OUR MOTO IS TO SHOW THE UNSEEN</p>
          </div>
        </div>
        <div className="card" style={{ minHeight: '420px' }}>
          <p>
            <strong>Tourism: A Gateway to Exploration and Economic Growth</strong>
          </p>
          <p className="small-text">
            Tourism is a vital industry that connects people with diverse cultures, landscapes, and
            experiences. It involves traveling for leisure, business, or cultural exploration,
            contributing significantly to local and global economies.
          </p>
          <p className="small-text">
            One of the key benefits of tourism is its economic impact. It generates employment in
            various sectors such as hospitality, transportation, and entertainment. Many countries
            rely on tourism as a major source of revenue, attracting millions of visitors each year.
          </p>
          <p className="small-text">
            Sustainable tourism has gained importance in recent years, emphasizing responsible travel
            that minimizes environmental impact and benefits local communities. Ecotourism encourages
            travelers to explore nature while preserving ecosystems.
          </p>
        </div>
      </div>
      <div className="page-panel" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <p style={{ textAlign: 'center', margin: 0 }}>
          For further more details contact: 1234567890<br />or mail to us: abc123@gmail.com
        </p>
      </div>
    </section>
  );
};

export default AboutPage;
