import { useEffect, useRef } from 'react';

/**
 * Attaches an IntersectionObserver to all .reveal elements
 * inside the given container ref (default: document).
 * Adds .visible class when they scroll into view.
 */
export default function useReveal(deps = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const targets = (containerRef.current || document).querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Animate skill bars if present
            entry.target.querySelectorAll('[data-width]').forEach((bar) => {
              bar.style.width = bar.dataset.width + '%';
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
