import React, { useEffect } from "react";

const LocalStorageFallback = () => {
  useEffect(() => {
    setTimeout(() => {
      console.error("localStorage is disabled");
    }, 5000);
  }, []);

  return (
    <main className="h-screen text-center w-full flex justify-center items-center font-semibold px-8 uppercase">Error.</main>
  );
};

export default LocalStorageFallback;
