import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* Interactive Scrolling Background */}
      <div className="landing-bg"></div>

      {/* Content Wrapper */}
      <div className="landing-content">
        
        {/* Title & Description */}
        <div className="landing-hero-text">
          <h1 className="landing-title">
            <span className="landing-title-dsa">DSA</span>
            <br />
            <span className="landing-title-odyssey">ODYSSEY</span>
          </h1>
          <p className="landing-subtitle">
            A pixel-art RPG where mastering Data Structures & Algorithms is your only weapon. 
            Reclaim the ancient patterns, level up your skills, and conquer your next coding interview.
          </p>
        </div>

        {/* Action Box */}
        <div className="landing-wizard-section">
          <div className="rpg-dialogue-box">
            <div className="rpg-dialogue-text" style={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}>
              "The Kingdom of Algorithms has fallen into chaos. 
              Only one who masters the ancient patterns can restore order. Are you ready?"
            </div>
            <div className="rpg-dialogue-action" style={{ textAlign: 'center' }}>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button className="btn-gold landing-start-btn">
                  ⚔️ Start Adventure
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
