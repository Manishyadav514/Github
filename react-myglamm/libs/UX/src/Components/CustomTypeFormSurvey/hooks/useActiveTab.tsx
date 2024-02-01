import { useState, useEffect } from "react";

const useActiveTab = (trackedNode: any) => {
  const [activeTab, setActiveTab] = useState(0);

  const observerCallback = (entries: any[]) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        const VISIBLE_TAB_INDEX = parseInt(entry.target.dataset.index);
        setActiveTab(VISIBLE_TAB_INDEX);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, { threshold: 0.5 });
    if (trackedNode.current) {
      const TABS = (trackedNode.current as HTMLDivElement).children;
      Array.from(TABS)?.forEach((element: any, index: number) => {
        const CURRENT_TAB = TABS[index] as HTMLElement;
        observer.observe(CURRENT_TAB);
        CURRENT_TAB.dataset.index = index.toString();
      });
    }
  }, []);

  return activeTab;
};

export default useActiveTab;
