import { uploadCollage } from "@/firebase/storage";
import toast from "react-hot-toast";
import { saveCanvas } from "./fabricCanvas";
import * as fabric from "fabric";

export const toastUploadCollage = async (visitorId: string, file: File) => {
  return toast.promise(uploadCollage(visitorId, file), {
    loading: "アップロード中...",
    success: (data) => `アップロード完了: ${data.name}`,
    error: (error) => `アップロード失敗: ${error.toString()}`,
  });
};

export const toastUploadWork = (
  canvas: fabric.Canvas | null,
  visitorId: string
) => {
  return toast.promise(saveCanvas(canvas, visitorId), {
    loading: "アップロード中...",
    success: (data) => `アップロード完了: ${data!.name}`,
    error: (error) => `アップロード失敗: ${error.toString()}`,
  });
};
