import { Addresses } from "@/constants/202004";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import InfiniteScroll from "./infiniteScroll";

interface OpenProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PAGEPERCOUNT = 30;

// Info: 사용하면 좋은 함수 "debounce", "union"
export default function Modal(props: OpenProps) {
  // Don't touch this code (START)
  const { open, setOpen } = props;
  const cancelButtonRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const targetSheetRef = useRef(null);
  const [bottomSheet, setBottomSheet] = useState<any>(null);
  const [targetSheet, setTargetSheet] = useState<any>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setBottomSheet(bottomSheetRef.current);
        setTargetSheet(targetSheetRef.current);
      }, 0);
    }
  }, [open]);
  useEffect(() => {
    let startY = 0; // info: 터치한 곳의 y값 (약간의 오차가 있지만 변하지 않음)

    const handleTouchStart = (e: TouchEvent) => {
      targetSheet.style.transition = "";
      if (e.target === bottomSheet) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY; // info: touch하고 있는 곳의 y값
      const maxHeight = window.innerHeight - targetSheet.clientHeight;
      let yScalar = currentY - startY;

      if (yScalar < maxHeight + 100) {
        yScalar = maxHeight + 100; // info: 상단 제한
      }
      targetSheet.style.transform = `translateY(${yScalar}px)`;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const currentY = e.changedTouches[0].clientY;
      const yScalar = currentY - startY;

      if (yScalar > window.innerHeight / 6) {
        setOpen(false);
      } else {
        targetSheet.style.transition = `transform 0.25s ease-out`;
        targetSheet.style.transform = `translateY(0px)`;
      }
    };

    bottomSheet?.addEventListener("touchstart", handleTouchStart);
    bottomSheet?.addEventListener("touchmove", handleTouchMove);
    bottomSheet?.addEventListener("touchend", handleTouchEnd);

    return () => {
      bottomSheet?.removeEventListener("touchstart", handleTouchStart);
      bottomSheet?.removeEventListener("touchmove", handleTouchMove);
      bottomSheet?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [bottomSheet]);
  // Don't touch this code (END)

  const [filteredAddress, setFilteredAddress] = useState<string[]>(Addresses.slice(0, PAGEPERCOUNT));
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    setOptions(filteredAddress)
  }, [filteredAddress])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div
          className="fixed inset-0 z-10 w-screen overflow-y-auto bottom-[-10%]"
          ref={targetSheetRef}
        >
          <div className="flex min-h-full items-end justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-3/4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-3/4"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all w-full max-w-md rounded-t-5 h-screen">
                <div className="w-full py-5" ref={bottomSheetRef}>
                  <div className="border-y-2 w-9 mx-auto rounded-full" />
                </div>
                <div className="mx-5 mb-6.25">
                  <input
                    type="text"
                    className="block w-full bg-thang-f5 p-3.75 rounded-3.5 text-black placeholder:text-thang-9"
                    placeholder="예) 서울시 영등포구 여의도동"
                    onChange={(event) => {
                      console.log('==== Query Changed ====');
                    }}
                  />
                </div>
                <div
                  className="overflow-scroll"
                  style={{
                    height: "calc(90% - 100px - 16px)",
                    transition: "height 0.2s ease-out",
                  }}
                >
                  {filteredAddress.length > 0 ? (
                    <InfiniteScroll
                    >
                      {options.map((option: string, index: number) => {
                        return (
                          <div key={option}>
                            <div className="relative cursor-default select-none py-3.75 pl-8.75 pr-5 flex justify-between">
                              <span className="text-sm font-medium">
                                {option}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </InfiniteScroll>
                  ) : (
                    <div className="bg-thang-f9 w-full h-full flex items-center justify-center">
                      <p className="text-thang-9 pb-[120px]">
                        "검색창에 주소를 입력해주세요"
                      </p>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
