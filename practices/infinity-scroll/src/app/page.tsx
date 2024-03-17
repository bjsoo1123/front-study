"use client";

import { useRef, useEffect } from "react";

export default function Home() {
  const infiniteRef = useRef<HTMLDivElement>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const debounce = (func: () => void, timeout = 300) => {
    let timer: NodeJS.Timeout;
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        func();
      }, timeout);
    };
  }

  // useEffect(() => debounce(() => {
  //   observer.current = new IntersectionObserver((entries) => {
  //     const firstEntry = entries[0];
  //     console.log('OBSERVE', firstEntry.isIntersecting);
  //   },
  //   { threshold: 1 }
  //   )
  // }), [])

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      console.log('OBSERVE', firstEntry.isIntersecting);
    },
    { threshold: 1 }
    );
  }, [])

  useEffect(() => {
    if (infiniteRef.current && observer.current) {
      observer.current.observe(infiniteRef.current)
    }
  }, [infiniteRef])

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
