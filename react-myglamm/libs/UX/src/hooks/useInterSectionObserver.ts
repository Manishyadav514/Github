/**
 * Author : Yogesh Kotadiya <hi@yogeshkotadiya.com>
 */
import { useRef, useState, useEffect, RefObject } from "react";

export interface ObserverOptions {
  root?: HTMLElement;
  rootMargin?: string;
  threshold?: number;
}

function useScreenObserver(options: ObserverOptions): [boolean, RefObject<HTMLInputElement>] {
  // State and setter for storing whether element is visible
  const setRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Update our state when observer callback fires
      setVisible(entry.isIntersecting);
    }, options);
    const ref = setRef;
    if (setRef && setRef.current) {
      observer.observe(setRef.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [setRef, options]);

  return [visible, setRef];
}

export default useScreenObserver;
