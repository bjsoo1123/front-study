const innerHeightGap = 10;

let startY = 0; // info: 터치한 곳의 y값 (약간의 오차가 있지만 변하지 않음)
let yScalar = 0; // info: targetSheet가 이동할 거리
let lastTime = 0; // info: last touch에 대한 Time
let gapTime = 0; // info: 마지막 two touch에 대한 걸린 시간
let movedPosition = 0; // info: 마지막 two touch에 대한 이동 거리

const calculateMovedScalar = (prevScalar: number, currentScalar: number) => {
  movedPosition = currentScalar - prevScalar;
};

const calculateGapTime = () => {
  gapTime = new Date().getTime() - lastTime;
  lastTime += gapTime;
};

const modalTouchEvents = (
  targetSheet: HTMLDivElement,
  bottomSheet: HTMLDivElement,
  setHeight: (height: number) => void,
  closeModal: () => void
) => {
  const handleTouchStart = (e: TouchEvent) => {
    targetSheet.style.transition = "";
    lastTime = new Date().getTime();

    if (e.target === bottomSheet) {
      startY = e.touches[0].clientY - yScalar;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentY = e.touches[0].clientY; // info: touch하고 있는 곳의 y값
    const maxHeight = window.innerHeight - targetSheet.clientHeight;

    calculateGapTime();
    calculateMovedScalar(yScalar, currentY - startY);
    yScalar = currentY - startY;

    if (yScalar < maxHeight + 100) {
      yScalar = maxHeight + 100; // info: 상단 제한
    }

    setHeight(window.innerHeight - currentY - innerHeightGap); // info: 이동에 따른 높이 변경
    targetSheet.style.transform = `translateY(${yScalar}px)`;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const currentY = e.changedTouches[0].clientY;

    if (gapTime > 0) {
      const vertor = movedPosition / gapTime; // info: 마지막 two touch에 대한 vector
      yScalar = yScalar + (vertor / 2) * 250; // info: 이건 제 잔상입니다만...

      const isDownDirection = vertor > 0;
      const heightUnitByFive = window.innerHeight / 5;

      if (currentY + yScalar > heightUnitByFive * 3) {
        if (isDownDirection) {
          closeModal();
        } else {
          yScalar = heightUnitByFive * 3 - startY;
          setHeight(heightUnitByFive * 2 - innerHeightGap);
        }
      } else {
        if (isDownDirection) {
          yScalar = heightUnitByFive * 3 - startY;
          setHeight(heightUnitByFive * 2 - innerHeightGap);
        } else {
          yScalar = heightUnitByFive * 1 - startY;
          setHeight(heightUnitByFive * 4 - innerHeightGap);
        }
      }

      targetSheet.style.transition = `transform 0.25s ease-out`;
      targetSheet.style.transform = `translateY(${yScalar}px)`;
    }
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
};

export { modalTouchEvents };
