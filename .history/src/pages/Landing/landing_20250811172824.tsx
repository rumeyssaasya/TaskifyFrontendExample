import React, { useRef, useEffect, useState } from "react";

const features = [
  {
    title: "Özellik 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vehicula.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Özellik 2",
    description:
      "Suspendisse potenti. Curabitur lobortis enim sed sapien vestibulum.",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Özellik 3",
    description:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices.",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Özellik 4",
    description:
      "Phasellus non purus eu lectus tincidunt vestibulum ut sit amet urna.",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Özellik 5",
    description:
      "Mauris feugiat augue sed enim sodales, et tempor ligula sagittis.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
  },
];

const StickyFullPageScroll = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = window.innerHeight;
    const index = Math.round(scrollTop / height);
    setActiveIndex(index);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky-container" ref={containerRef}>
      {features.map((feature, idx) => (
        <section
          key={idx}
          className={`sticky-block ${activeIndex === idx ? "active" : ""}`}
          style={{ backgroundImage: `url(${feature.image})` }}
        >
          <div className="overlay">
            <h1>{feature.title}</h1>
            <p>{feature.description}</p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default StickyFullPageScroll;
