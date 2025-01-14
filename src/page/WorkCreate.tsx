import { useSelectedCollageStore } from "@/store/selectedCollageStore";
import { useIdentityStore } from "@/store/userIdentityStore";
import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { Toaster } from "react-hot-toast";
import { getCollageFromSelectedCollage } from "@/firebase/storage";
import { Collage } from "@/model/Collage";
import { initFabricCanvas } from "@/util/fabricCanvas";
import { toastUploadWork } from "@/util/toast";

export default function WorkCreate() {
  const { visitorId } = useIdentityStore();
  const { selectedCollage } = useSelectedCollageStore();

  const [collageList, setCollageList] = useState<Collage[]>([]);
  const [reArrangeCount, setReArrangeCount] = useState(0);

  useEffect(() => {
    const fetchCollages = async () => {
      const collages = await getCollageFromSelectedCollage(selectedCollage);
      setCollageList(collages);
    };

    fetchCollages();
  }, [selectedCollage]);

  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasEl.current || collageList.length === 0) {
      return;
    }
    const options = {
      width: window.innerWidth,
      height:
        window.innerHeight -
        3 * parseFloat(getComputedStyle(document.documentElement).fontSize),
    };

    const canvas = new fabric.Canvas(canvasEl.current, options);
    canvasRef.current = canvas;

    initFabricCanvas(canvas, collageList);

    return () => {
      canvas.dispose();
    };
  }, [collageList, reArrangeCount]);
  return (
    <>
      <Toaster />
      <main className="relative h-[calc(100vh-3rem)] bg-[url('/paper.jpg')] bg-cover bg-center">
        <canvas ref={canvasEl} />
        <div className="absolute left-2 top-2 flex gap-4">
          <div
            className=" cursor-pointer select-none text-4xl"
            onClick={() => {
              setReArrangeCount((prev) => prev + 1);
            }}
          >
            🔁
          </div>
          <div
            className="cursor-pointer select-none text-4xl"
            onClick={() => {
              toastUploadWork(canvasRef.current, visitorId);
            }}
          >
            💾
          </div>
        </div>
      </main>
    </>
  );
}
