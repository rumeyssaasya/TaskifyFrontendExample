import React, { useState, useRef, useEffect } from 'react';
import './FeaturesSection.css'; // Make sure the CSS file is imported

const features = [
  { title: 'Feature 1', description: 'Lorem ipsum dolor sit amet...', image: 'image1.jpg' },
  { title: 'Feature 2', description: 'Consectetur adipiscing elit...', image: 'image2.jpg' },
  { title: 'Feature 3', description: 'Sed do eiusmod tempor incididunt...', image: 'image3.jpg' },
  { title: 'Feature 4', description: 'Ut labore et dolore magna aliqua...', image: 'image4.jpg' },
  { title: 'Feature 5', description: 'Enim ad minim veniam...', image: 'image5.jpg' },
];

function FeaturesSection() {
  const containerRef = useRef(null);
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