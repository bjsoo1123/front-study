import React, { useEffect, useRef } from "react";

interface InfiniteScrollProps {
  children?: React.ReactNode;
  onNextPage?: () => void;
}

const observerOption = {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: 0.5
};

const InfiniteScroll = ({ children, onNextPage }: InfiniteScrollProps) => {
  const ref = useRef(null);
  let timer: any;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && onNextPage) {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        onNextPage();
      }, 500);
    }
  }, observerOption);

  useEffect(() => {
    ref.current && observer.observe(ref.current);
  }, []);

  return (
    <div>
      <div>{children}</div>
      <div ref={ref} className="w-full h-10 bg-gray-200" />
    </div>
  );
};

export default InfiniteScroll;
