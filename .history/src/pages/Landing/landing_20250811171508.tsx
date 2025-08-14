import React, { useState, useRef, useEffect } from 'react';

const features = [
  { title: 'Özellik 1', description: 'Lorem ipsum dolor sit amet...', image: 'image1.jpg' },
  { title: 'Özellik 2', description: 'Consectetur adipiscing elit...', image: 'image2.jpg' },
  { title: 'Özellik 3', description: 'Sed do eiusmod tempor incididunt...', image: 'image3.jpg' },
  { title: 'Özellik 4', description: 'Ut labore et dolore magna aliqua...', image: 'image4.jpg' },
  { title: 'Özellik 5', description: 'Enim ad minim veniam...', image: 'image5.jpg' },
];

function FeaturesSection() {
  // HTMLDivElement tipi ile ref tanımlandı, başlangıçta null olabilir
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!containerRef.current) return; // null kontrolü
    const scrollLeft = containerRef.current.scrollLeft;
    const width = containerRef.current.clientWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
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
