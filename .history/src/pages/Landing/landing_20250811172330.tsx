import React, { useState, useRef, useEffect } from 'react';
import './landing.css'; // Make sure the CSS file is imported
import img1 from '../../assets/images/1.png';
import img2 from '../../assets/images/2.png'; 
import img3 from '../../assets/images/3.png';  
import img4 from '../../assets/images/4.png';
import img5 from '../../assets/images/5.png';      
const features = [
  { title: 'Feature 1', description: 'Lorem ipsum dolor sit amet...', image: img1 },
  { title: 'Feature 2', description: 'Consectetur adipiscing elit...', image: img2 },
  { title: 'Feature 3', description: 'Sed do eiusmod tempor incididunt...', image: img3 },
  { title: 'Feature 4', description: 'Ut labore et dolore magna aliqua...', image: img4 },
  { title: 'Feature 5', description: 'Enim ad minim veniam...', image: img5 },
];

function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use a function to calculate the active index
    const updateActiveIndex = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      const index = Math.round(scrollLeft / width);
      setActiveIndex(index);
    };

    // Use `scroll` event to update the index
    container.addEventListener('scroll', updateActiveIndex);

    // Initial check in case the component renders at a non-zero scroll position
    updateActiveIndex();

    return () => {
      container.removeEventListener('scroll', updateActiveIndex);
    };
  }, []);

  return (
    <div className="features-horizontal-section" ref={containerRef}>
      {features.map((feature, i) => (
        <div
          key={i}
          className={`feature-block ${activeIndex === i ? 'active' : ''}`}
        >
          <div className="feature-image">
            <img src={feature.image} alt={feature.title} />
          </div>
          <div className="feature-text">
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeaturesSection;