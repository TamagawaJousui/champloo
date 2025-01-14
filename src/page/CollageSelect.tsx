import { storage } from "@/firebase/firebse";
import { ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage";
import { useIdentityStore } from "@/stores/userIdentityStore";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

// Default Collage List
const getDefaultCollageList = async () => {
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
const getUserCollageList = async (visitorId: string) => {
  const visitorFolderRef = ref(storage, visitorId);
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

const uploadCollage = async (visitorId: string, collage: File) => {
  // Get reference to visitor's folder
  const visitorFolderRef = ref(storage, visitorId);

  // Get existing files in the folder
  const fileList = await listAll(visitorFolderRef);
  const nextNumber = fileList.items.length;

  // Format the file number with leading zeros (000, 001, etc.)
  const fileNumber = nextNumber.toString().padStart(3, "0");

  // Create reference with numbered filename
  const storageRef = ref(storage, `${visitorId}/${fileNumber}.png`);
  const res = await uploadBytes(storageRef, collage);
  const url = await getDownloadURL(res.ref); // 获取新上传文件的URL
  return {
    name: res.ref.name,
    url: url,
    path: `${visitorId}/${res.ref.name}`,
  };
};

const toastUploadCollage = (visitorId: string, file: File) => {
  toast.promise(uploadCollage(visitorId, file), {
    loading: "アップロード中...",
    success: (data) => `アップロード完了: ${data.name}`,
    error: (error) => `アップロード失敗: ${error.toString()}`,
  });
};

export default function CollageSelect() {
  const { visitorId } = useIdentityStore();
  const [defaultCollageList, setDefaultCollageList] = useState<
    Array<{ name: string; url: string; path: string }>
  >([]);
  const [userCollageList, setUserCollageList] = useState<
    Array<{ name: string; url: string; path: string }>
  >([]);
  const [selectedCollageList, setSelectedCollageList] = useState<Set<string>>(
    new Set()
  );
  const navigate = useNavigate();

  const handleUploadCollage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await toastUploadCollage(visitorId, file);
      setTimeout(async () => {
        const newCollageList = await getUserCollageList(visitorId);
        setUserCollageList(newCollageList);
      }, 3000);
    }
  };

  useEffect(() => {
    const fetchCollages = async () => {
      const collages = await getDefaultCollageList();
      setDefaultCollageList(collages);
    };

    const fetchUserCollages = async () => {
      const collages = await getUserCollageList(visitorId);
      setUserCollageList(collages);
    };

    fetchCollages();
    fetchUserCollages();
  }, [visitorId]);

  return (
    <>
      <Toaster />
      <main className="relative py-8 pl-24 pr-48">
        <button
          className="fixed bottom-12 right-8 flex flex-col items-center justify-center whitespace-pre-wrap rounded-full bg-[#E8ACAC]/70 px-12 py-2 text-white  transition-transform active:scale-95"
          onClick={() => navigate("/work-create")}
        >
          <span className="text-2xl font-bold">次へ</span>
          <span className="font-serif">NEXT</span>
          <span className="absolute top-0 -translate-y-full font-bold text-[#D0BCBC]/50">
            {`${selectedCollageList.size}個を選んだ`}
          </span>
        </button>
        <h1 className="text-2xl font-bold">コラージュリスト</h1>
        <h2 className="pb-4 pt-12 text-xl font-bold text-[#AE8A91]">
          自分のコラージュ
        </h2>
        <div className="relative flex flex-wrap gap-x-16 gap-y-12">
          {userCollageList.map((collage) => (
            <div key={collage.name}>
              <img src={collage.url} alt={collage.name} className="size-36" />
              <div className="flex items-center justify-between">
                <p>{collage.name.replace(".png", "")}</p>
                <input
                  type="checkbox"
                  checked={selectedCollageList.has(collage.path)}
                  onChange={() =>
                    setSelectedCollageList((prev) => {
                      const newSet = new Set(prev);
                      newSet[newSet.has(collage.path) ? "delete" : "add"](
                        collage.path
                      );
                      console.log(newSet);
                      return newSet;
                    })
                  }
                />
              </div>
            </div>
          ))}
          <label
            htmlFor="upload-collage"
            className="flex size-36 items-center justify-center"
          >
            <input
              id="upload-collage"
              type="file"
              onChange={handleUploadCollage}
              accept="image/*"
              className="hidden"
            />
            <div className="relative size-20 cursor-pointer rounded-full bg-[#ECD0D0] transition-transform active:scale-50">
              <div className="absolute left-1/2 top-1/2 h-1 w-10 -translate-x-1/2 -translate-y-1/2 bg-white"></div>
              <div className="absolute left-1/2 top-1/2 h-10 w-1 -translate-x-1/2 -translate-y-1/2 bg-white"></div>
            </div>
          </label>
        </div>

        <h2 className="pb-4 pt-12 text-xl font-bold text-[#AE8A91]">
          他人のコラージュ
        </h2>
        <div className="flex flex-wrap gap-x-16 gap-y-12">
          {defaultCollageList.map((collage) => (
            <div key={collage.name}>
              <img src={collage.url} alt={collage.name} className="size-36" />
              <div className="flex items-center justify-between">
                <p>{collage.name.replace(".png", "")}</p>
                <input
                  type="checkbox"
                  checked={selectedCollageList.has(collage.path)}
                  onChange={() =>
                    setSelectedCollageList((prev) => {
                      const newSet = new Set(prev);
                      newSet[newSet.has(collage.path) ? "delete" : "add"](
                        collage.path
                      );
                      console.log(newSet);
                      return newSet;
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
