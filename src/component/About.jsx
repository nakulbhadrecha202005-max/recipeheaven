import React from 'react';
import '../Styles/About.css';

const About = () => {
  return (
    <div className="about-wrapper">
      <section className="about-hero" style={{ marginTop: '5vw' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 pe-lg-5">
              <h6 className="text-uppercase fw-bold mb-3" style={{ color: '#FF9933', letterSpacing: '3px' }}>Namaste & Welcome</h6>
              <h1 className="display-4 fw-bold mb-4">Bringing the <span style={{ color: '#2A9D8F' }}>Soul of Indian</span> Kitchens to You.</h1>
              <div className="mission-box">
                <p className="lead text-muted">Born in 2024, RecipeHeaven was created to celebrate the rich heritage of spices and the warmth of home-cooked meals, making gourmet cooking accessible to every student and home.</p>
              </div>
              <p className="text-secondary">From the street flavors of Mumbai to the royal kitchens of Lucknow, we provide a clean, eye-friendly space for over 1,000 food lovers to explore recipes without any cost.</p>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0">
              <img src="https://plus.unsplash.com/premium_photo-1680291971376-ccc54aacb22b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="story-img" alt="Spices of India" />
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default About;