import { storage } from "@/firebase/firebase";
import { ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage";

// Default Collage List
export const getDefaultCollageList = async () => {
  const elementsRef = ref(storage, "elements");
  const res = await listAll(elementsRef);
  console.log(res.items.length);

  const fileUrls = await Promise.all(
    res.items.map(async (item) => {
      const url = await getDownloadURL(item);
      return {
        name: item.name,
        url: url,
        path: `elements/${item.name}`,
      };
    })
  );

  return fileUrls;
};

// User Collage List
export const getUserCollageList = async (visitorId: string) => {
  const visitorFolderRef = ref(storage, `collages/${visitorId}`);
  const res = await listAll(visitorFolderRef);

  const fileUrls = await Promise.all(
    res.items.map(async (item) => {
      const url = await getDownloadURL(item);
      return {
        name: item.name,
        url: url,
        path: `${visitorId}/${item.name}`,
      };
    })
  );

  return fileUrls;
};

// Other Collage List
export const getOtherCollageList = async (visitorId: string) => {
  const collageFolderRef = ref(storage, "collages");
  const res = await listAll(collageFolderRef);

  // 过滤掉当前访问者的文件夹，并获取其他文件夹中的作品
  const otherFoldersResults = await Promise.all(
    res.prefixes
      .filter((folder) => folder.name !== visitorId)
      .map((folder) => listAll(folder))
  );

  // 将所有作品的信息整合到一个数组中
  const allFiles = await Promise.all(
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
  return allFiles;
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
    path: `${visitorId}/${res.ref.name}`,
  };
};
