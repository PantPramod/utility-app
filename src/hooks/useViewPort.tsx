import { useState, useEffect } from 'react';

function useViewport() {
  // Initialize state with the current window width and height
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Define a function to update the state with the current window dimensions
  const handleResize = () => {
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Add the event listener on mount and clean up on unmount
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty array ensures this effect runs only once

  return viewport;
}

export default useViewport;
