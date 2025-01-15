import { useSelectedCollageStore } from "@/store/selectedCollageStore";
import { useIdentityStore } from "@/store/userIdentityStore";
import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { Toaster } from "react-hot-toast";
import { useSelectedCollages } from "@/hooks/useStorage";
import { initFabricCanvas } from "@/util/fabricCanvas";
import { toastUploadWork } from "@/util/toast";

export default function WorkCreate() {
  const { visitorId } = useIdentityStore();
  const { selectedCollage, regenerateAllPositions } = useSelectedCollageStore();

  const { data: collageList, isLoading: isCollageListLoading } =
    useSelectedCollages(new Set(selectedCollage.keys()));

  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasEl.current || !collageList) {
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
  }, [collageList, selectedCollage]);
  return (
    <>
      <Toaster />
      <main className="relative h-[calc(100vh-3rem)] bg-[url('/paper.jpg')] bg-cover bg-center">
        <canvas ref={canvasEl} />
        <div className="absolute left-2 top-2 flex gap-4">
          <div
            className=" cursor-pointer select-none text-4xl"
            onClick={() => {
              regenerateAllPositions();
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
          <div className="animate-spin select-none text-4xl">
            {isCollageListLoading && "⏳"}
          </div>
        </div>
      </main>
    </>
  );
}
