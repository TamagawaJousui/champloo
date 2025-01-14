import { storage } from "@/firebase/firebase";
import { ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage";

// Default Collage List
export const getDefaultCollageList = async () => {
  const elementsRef = ref(storage, "elements");
  const res = await listAll(elementsRef);

  const collages = await Promise.all(
    res.items.map(async (item) => {
      const url = await getDownloadURL(item);
      return {
        name: item.name,
        url: url,
        path: item.fullPath,
      };
    })
  );

  return collages;
};

// User Collage List
export const getUserCollageList = async (visitorId: string) => {
  const visitorFolderRef = ref(storage, `collages/${visitorId}`);
  const res = await listAll(visitorFolderRef);

  const collages = await Promise.all(
    res.items.map(async (item) => {
      const url = await getDownloadURL(item);
      return {
        name: item.name,
        url: url,
        path: item.fullPath,
      };
    })
  );

  return collages;
};

// Other Collage List
export const getOtherCollageList = async (visitorId: string) => {
  const collageFolderRef = ref(storage, "collages");
  const res = await listAll(collageFolderRef);

  const otherFoldersResults = await Promise.all(
    res.prefixes
      .filter((folder) => folder.name !== visitorId)
      .map((folder) => listAll(folder))
  );

  const collages = await Promise.all(
    otherFoldersResults.flatMap((folderResult) =>
      folderResult.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          url: url,
          path: item.fullPath,
        };
      })
    )
  );
  return collages;
};

export const uploadCollage = async (visitorId: string, collage: File) => {
  // Get reference to visitor's folder
  const visitorFolderRef = ref(storage, `collages/${visitorId}`);

  // Get existing files in the folder
  const fileList = await listAll(visitorFolderRef);
  const nextNumber = fileList.items.length;

  // Format the file number with leading zeros (000, 001, etc.)
  const fileNumber = nextNumber.toString().padStart(3, "0");

  // Create reference with numbered filename
  const storageRef = ref(storage, `collages/${visitorId}/${fileNumber}.png`);
  const res = await uploadBytes(storageRef, collage);
  const url = await getDownloadURL(res.ref); // 获取新上传文件的URL
  return {
    name: res.ref.name,
    url: url,
    path: res.ref.fullPath,
  };
};

export const getCollageFromSelectedCollage = async (
  collagePath: Set<string>
) => {
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

export const uploadWork = async (visitorId: string, work: Blob) => {
  const visitorFolderRef = ref(storage, `works/${visitorId}`);

  // Get existing files in the folder
  const fileList = await listAll(visitorFolderRef);
  const nextNumber = fileList.items.length;

  // Format the file number with leading zeros (000, 001, etc.)
  const fileNumber = nextNumber.toString().padStart(3, "0");

  // Create reference with numbered filename
  const storageRef = ref(storage, `works/${visitorId}/${fileNumber}.jpeg`);
  const res = await uploadBytes(storageRef, work);
  const url = await getDownloadURL(res.ref);
  return {
    name: res.ref.name,
    url: url,
    path: res.ref.fullPath,
  };
};
