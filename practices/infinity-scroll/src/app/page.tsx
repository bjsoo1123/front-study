"use client";

import { useState, useRef } from "react";

export default function Home() {
  const infiniteRef = useRef<HTMLDivElement>(null);

  const observer = new IntersectionObserver((entries, observer) => {
    const firstEntry = entries[0];
    console.log('OBSERVE', firstEntry.isIntersecting);
  }
);

  if (infiniteRef.current) {
    observer.observe(infiniteRef.current);
  }

  return (
    <>
      <div style={{ backgroundColor: 'aqua', height: '300px', marginBottom: '10px' }}>YAP</div>
      <div style={{ backgroundColor: 'aqua', height: '300px', marginBottom: '10px' }}>YAP</div>
      <div style={{ backgroundColor: 'aqua', height: '300px', marginBottom: '10px' }}>YAP</div>
      <div style={{ backgroundColor: 'aqua', height: '300px', marginBottom: '10px' }}>YAP</div>
      <div style={{ backgroundColor: 'aqua', height: '300px', marginBottom: '10px' }}>YAP</div>
      <div style={{ backgroundColor: 'yellow', height: '100px', marginBottom: '10px' }} ref={infiniteRef}>INFINITE</div>
    </>
  );
}
