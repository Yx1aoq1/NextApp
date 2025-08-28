import { useEffect, useState } from 'react';

const useDocumentVisibilityChange = (onVisibilityChange?: (isVisible: boolean) => void): boolean => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isDocumentVisible = document.visibilityState === 'visible';
      setIsVisible(isDocumentVisible);

      if (onVisibilityChange) {
        onVisibilityChange(isDocumentVisible);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onVisibilityChange]);

  return isVisible;
};

export default useDocumentVisibilityChange;
