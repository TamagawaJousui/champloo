import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function TopPage() {
  const imgList = Array.from({ length: 49 }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return `/frames/c${num}.png`;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imgList.length);
    }, 1000 / 4); // 4fps = 250ms per frame

    return () => clearInterval(interval);
  }, [imgList.length]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[url('/paper.jpg')] bg-cover bg-center">
      <img src={imgList[currentIndex]} alt={`Frame ${currentIndex + 1}`} />
      <button
        className="flex translate-y-full flex-col items-center justify-center gap-2 whitespace-pre-wrap rounded-full bg-[#FFECE4]/70 px-12 py-4 text-white  transition-transform active:scale-95"
        onClick={() => navigate("/collage-select")}
      >
        <span className="text-4xl font-bold">スタート</span>
        <span className="font-serif">START</span>
      </button>
    </div>
  );
}
