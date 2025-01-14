import { storage } from "@/firebase/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { useSelectedCollageStore } from "@/stores/selectedCollageStore";
import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

const getCollageFromSelectedCollage = async (collagePath: Set<string>) => {
  const collageUrls = await Promise.all(
    Array.from(collagePath).map(async (path) => {
      const imgRef = ref(storage, path);
      const url = await getDownloadURL(imgRef);
      const name = path.split("/").pop() || "";
      return {
        name: name,
        url: url,
        path: path,
      };
    })
  );
  return collageUrls;
};

export default function WorkCreate() {
  const { selectedCollage } = useSelectedCollageStore();
  const [collageList, setCollageList] = useState<
    Array<{ name: string; url: string; path: string }>
  >([]);

  useEffect(() => {
    const fetchCollages = async () => {
      const collages = await getCollageFromSelectedCollage(selectedCollage);
      setCollageList(collages);
    };

    fetchCollages();
  }, [selectedCollage]);

  const canvasEl = useRef<HTMLCanvasElement>(null);

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

    const paper = new Image();
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
  }, [collageList]);
  return (
    <>
      <main>
        <canvas ref={canvasEl} />
      </main>
    </>
  );
}
