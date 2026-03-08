import React, { useEffect, useRef } from 'react';

export default function HeroComponent() {
  const canvasRef = useRef(null);
  const tubesInstance = useRef(null);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window === 'undefined') return;

    // Apply touch-action: none to body
    document.body.style.touchAction = 'none';

    // Dynamically import the Three.js component from the CDN
    import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js')
      .then((module) => {
        const TubesCursor = module.default;

        // Initialize the tubes effect
        tubesInstance.current = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ['#f967fb', '#53bc28', '#6958d5'],
            lights: {
              intensity: 200,
              colors: ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5'],
            },
          },
        });

        // Click handler to change colors
        const handleClick = () => {
          const colors = randomColors(3);
          const lightsColors = randomColors(4);
          tubesInstance.current?.tubes.setColors(colors);
          tubesInstance.current?.tubes.setLightsColors(lightsColors);
        };

        document.body.addEventListener('click', handleClick);

        // Cleanup on unmount
        return () => {
          document.body.removeEventListener('click', handleClick);
          // Optional: dispose Three.js resources if needed
          // (the library may not provide a dispose method)
        };
      })
      .catch((err) => {
        console.error('Failed to load Three.js tubes module', err);
      });
  }, []);

  // Helper to generate random hex colors
  const randomColors = (count) => {
    return new Array(count)
      .fill(0)
      .map(
        () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
      );
  };

  return (
    <>
      {/* Canvas for the 3D effect: llena el contenedor (p. ej. en login como fondo) */}
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute inset-0 w-full h-full block"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Hero content */}
      <div className="hero">
   
      </div>

      {/* Styles (embedded for simplicity) */}
      <style jsx>{`
        body, html, #app {
          margin: 0;
          width: 100%;
          height: 100%;
        }

        body {
          touch-action: none;
        }

        #canvas {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: hidden;
        }

        .hero {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        h1, h2, p {
          margin: 0;
          padding: 0;
          color: white;
          text-shadow: 0 0 20px rgba(0, 0, 0, 1);
          line-height: 100%;
          user-select: none;
        }

        h1 {
          font-size: 80px;
          font-weight: 700;
          text-transform: uppercase;
        }

        h2 {
          font-size: 60px;
          font-weight: 500;
          text-transform: uppercase;
        }

        a {
          text-decoration: none;
          color: #fff;
        }
      `}</style>
    </>
  );
};
