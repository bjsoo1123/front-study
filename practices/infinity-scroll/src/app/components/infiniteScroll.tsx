import React, { useState, useEffect, useRef } from "react";

const InfiniteScroll = ({
  dataLength = 1,
  next = () => {},
  query = "",
  children,
}: any) => {
  const scrollComponent = useRef<any>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageStateRef = useRef(currentPage);

  const handleScroll = () => {
    const target = scrollComponent?.current?.parentElement;

    if (target) {
      const {
        scrollTop: scrollY,
        clientHeight: screenHeight,
        scrollHeight: totalHeight,
      } = target;

      if (Math.ceil(scrollY) + screenHeight >= totalHeight) {
        // Info: 스크롤이 바닥에 닿을때
        const currentPageRef = pageStateRef.current;
        const currentItemCount = children?.length || 0;
        const hasMore = dataLength > currentItemCount * currentPageRef;

        if (hasMore) {
          const nextPage = currentPageRef + 1;
          pageStateRef.current = nextPage;
          next(nextPage);
          setCurrentPage((prev) => prev + 1);
        }
      }
    }
  };

  useEffect(() => {
    const target = scrollComponent?.current?.parentElement;
    pageStateRef.current = 1;

    target?.scrollTo({ top: 0 });
    target?.addEventListener("scroll", handleScroll);

    return () => {
      target?.removeEventListener("scroll", handleScroll);
    };
  }, [query]);

  return <div ref={scrollComponent}>{children}</div>;
};

export default InfiniteScroll;
