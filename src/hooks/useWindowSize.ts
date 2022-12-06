import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const handleWindowSize = () =>
    setWindowSize({
      width: window.innerWidth as any,
      height: window.innerHeight as any,
    });

  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener("resize", handleWindowSize);
      handleWindowSize();
      return () => window.removeEventListener("resize", handleWindowSize);
    }
  }, []);

  return { windowSize };
};

export default useWindowSize;
