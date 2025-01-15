import * as fabric from "fabric";
import { Collage } from "@/model/Collage";
import { uploadWork } from "@/firebase/storage";
import { useSelectedCollageStore } from "@/store/selectedCollageStore";

export const initFabricCanvas = (
  canvas: fabric.Canvas,
  collageList: Collage[]
) => {
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

  const selectedCollage = useSelectedCollageStore.getState().selectedCollage;

  collageList.map((item) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const fabricImg = new fabric.FabricImage(img);
      fabricImg.scaleToWidth(
        150 * ((selectedCollage.get(item.path)?.scale ?? Math.random()) + 0.5)
      );

      fabricImg.set({
        left:
          (selectedCollage.get(item.path)?.x ?? Math.random()) *
          (canvas.width! - 150),
        top:
          (selectedCollage.get(item.path)?.y ?? Math.random()) *
          (canvas.height! - 150),
        borderColor: "#505050",
        borderDashArray: [5, 5],
        cornerStyle: "circle",
        transparentCorners: false,
        rotatingPointOffset: 0,
        data: {
          path: item.path,
        },
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
};

export const saveCanvas = async (
  canvas: fabric.Canvas | null,
  visitorId: string
) => {
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
