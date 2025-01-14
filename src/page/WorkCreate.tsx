import { useSelectedCollageStore } from "@/stores/selectedCollageStore";
import { useIdentityStore } from "@/stores/userIdentityStore";
import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import toast, { Toaster } from "react-hot-toast";
import { getCollageFromSelectedCollage, uploadWork } from "@/firebase/storage";
import { Collage } from "@/models/Collage";

const saveCanvas = async (canvas: fabric.Canvas | null, visitorId: string) => {
  if (!canvas) {
    throw new Error("Canvas is null");
  }

  // Get data URL from Fabric.js canvas
  const dataUrl = canvas.toDataURL({ multiplier: 1, format: "jpeg" });

  // Convert data URL to Blob
  const blob = await fetch(dataUrl).then((res) => res.blob());

  try {
    return await uploadWork(visitorId, blob);
  } catch (error) {
    console.error("Error uploading:", error);
    throw error;
  }
};

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

  const toastUploadWork = () => {
    toast.promise(saveCanvas(canvasRef.current, visitorId), {
      loading: "アップロード中...",
      success: (data) => `アップロード完了: ${data!.name}`,
      error: (error) => `アップロード失敗: ${error.toString()}`,
    });
  };

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

    const paper = new Image();
    paper.crossOrigin = "anonymous";
    paper.onload = () => {
      const fabricBackground = new fabric.FabricImage(paper);
      const scaleX = window.innerWidth / paper.width;
      const scaleY = canvas.height! / paper.height;
      const scale = Math.max(scaleX, scaleY);

      fabricBackground.scale(scale);
      fabricBackground.set({
        selectable: false,
        evented: false,
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: "center",
        originY: "center",
      });
      canvas.add(fabricBackground);
    };
    paper.src = "/paper.jpg";

    collageList.map((item) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const fabricImg = new fabric.FabricImage(img);
        fabricImg.scaleToWidth(150 * (Math.random() + 1));

        fabricImg.set({
          left: Math.random() * (canvas.width! - 150),
          top: Math.random() * (canvas.height! - 150),
          borderColor: "#505050",
          borderDashArray: [5, 5],
          cornerStyle: "circle",
          transparentCorners: false,
          rotatingPointOffset: 0,
        });

        fabricImg.controls.tr.render = function (ctx, left, top) {
          ctx.save();
          ctx.fillStyle = "#5679CB";
          ctx.strokeStyle = "#505050";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(left, top, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        };

        fabricImg.controls.mtr.render = function (ctx, left, top) {
          ctx.save();
          ctx.fillStyle = "#FA1D49";
          ctx.strokeStyle = "#505050";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(left, top, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        };

        fabricImg.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
          bl: false,
          br: false,
          tl: false,
          tr: true,
          mtr: true,
        });

        canvas.add(fabricImg);
      };
      img.src = item.url;
    });

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
              toastUploadWork();
            }}
          >
            💾
          </div>
        </div>
      </main>
    </>
  );
}
