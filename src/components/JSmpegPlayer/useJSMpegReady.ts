import { useEffect, useState } from 'react';

/**
 * 检查 JSMpeg 是否已加载
 * @returns 是否已加载
 */
export const useJSMpegReady = () => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.JSMpeg) {
      setIsReady(true);
      return;
    }

    // Check if script is already being loaded or exists
    const existingScript = document.querySelector('script[src="/lib/jsmpeg/jsmpeg.min.js"]');
    if (existingScript) {
      // Script exists, wait for it to load
      if (window.JSMpeg) {
        setIsReady(true);
        return;
      }

      // Listen for the existing script to load
      const handleLoad = () => {
        if (window.JSMpeg) {
          setIsReady(true);
          setIsLoading(false);
        }
      };

      existingScript.addEventListener('load', handleLoad);
      setIsLoading(true);

      return () => {
        existingScript.removeEventListener('load', handleLoad);
      };
    }

    // Create and load the script dynamically
    setIsLoading(true);
    setError(null);

    const script = document.createElement('script');
    script.src = '/lib/jsmpeg/jsmpeg.min.js';
    script.async = true;

    const handleLoad = () => {
      if (window.JSMpeg) {
        setIsReady(true);
        setIsLoading(false);
      } else {
        setError('JSMpeg script loaded but JSMpeg object not found');
        setIsLoading(false);
      }
    };

    const handleError = () => {
      setError('Failed to load JSMpeg script');
      setIsLoading(false);
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };
  }, []);

  return { isReady, isLoading, error };
};

export default useJSMpegReady;
