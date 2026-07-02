import './PageStyles.css';

const DetailsPage = () => {
  return (
    <section>
      <div className="page-panel">
        <h1>DETAILS</h1>
        <p className="small-text">Review the terms, privacy, and booking details for your tour.</p>
      </div>
      <div className="page-panel">
        <h2>Booking and Account Terms</h2>
        <p className="small-text">
          1. All bookings should be completed with valid contact information.
          <br />
          2. Discounts may be applied through the discount page or code validation.
          <br />
          3. User accounts are stored in session storage and booking history is stored in local storage.
        </p>
        <p className="small-text">
          4. Please log in to retain your food selections and booking details between pages.
          <br />
          5. All package prices are indicative and may change based on availability.
          <br />
          6. For questions, contact 1234567890 or abc123@gmail.com.
        </p>
        <video
          controls
          width="100%"
          style={{ borderRadius: '16px', marginTop: '20px' }}
          src="videoplayback.mp4"
        >
          Sorry, your browser does not support embedded video.
        </video>
      </div>
    </section>
  );
};

export default DetailsPage;
