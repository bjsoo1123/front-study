import React, { useEffect, useRef } from "react";

interface InfiniteScrollProps {
  onNextSearch?: () => void;
  children?: React.ReactNode;
}

const InfiniteScroll = ({ children, onNextSearch }: InfiniteScrollProps) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio > 0 && entry.isIntersecting && onNextSearch) {
        onNextSearch();
      }
    })
    ref.current && observer.observe(ref.current);
  }, [onNextSearch]);

  return (
    <div>
      <div>{children}</div>
      <div ref={ref} className="w-full h-1" />
    </div>
  );
};

export default InfiniteScroll;
