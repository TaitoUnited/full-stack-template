import { useEffect, useState } from 'react';

const hour = 3600000;

// Based on idea from creators of React Router: https://gist.github.com/ryanflorence/2c50e77768e3f88b1c7251ef95ed01d3
export const useStaleReload = () => {
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setIsStale(true);
    }, hour * 12);
    return () => clearTimeout(id);
  }, []);

  return isStale;
};

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
