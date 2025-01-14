import { uploadCollage } from "@/firebase/storage";
import toast from "react-hot-toast";
import { saveCanvas } from "./fabricCanvas";
import * as fabric from "fabric";

export const toastUploadCollage = (visitorId: string, file: File) => {
  toast.promise(uploadCollage(visitorId, file), {
    loading: "アップロード中...",
    success: (data) => `アップロード完了: ${data.name}`,
    error: (error) => `アップロード失敗: ${error.toString()}`,
  });
};

export const toastUploadWork = (
  canvas: fabric.Canvas | null,
  visitorId: string
) => {
  toast.promise(saveCanvas(canvas, visitorId), {
    loading: "アップロード中...",
    success: (data) => `アップロード完了: ${data!.name}`,
    error: (error) => `アップロード失敗: ${error.toString()}`,
  });
};
