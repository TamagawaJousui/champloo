import { useIdentityStore } from "@/store/userIdentityStore";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useSelectedCollageStore } from "@/store/selectedCollageStore";
import clsx from "clsx";
import {
  getDefaultCollageList,
  getOtherCollageList,
  getUserCollageList,
} from "@/firebase/storage";
import CollageItem from "@/component/CollageItem";
import { Collage } from "@/model/Collage";
import { toastUploadCollage } from "@/util/toast";

export default function CollageSelect() {
  const { visitorId } = useIdentityStore();

  const { selectedCollage, setSelectedCollage } = useSelectedCollageStore();

  const [defaultCollageList, setDefaultCollageList] = useState<Collage[]>([]);
  const [userCollageList, setUserCollageList] = useState<Collage[]>([]);
  const [otherCollageList, setOtherCollageList] = useState<Collage[]>([]);

  const [selectedCollageList, setSelectedCollageList] =
    useState<Set<string>>(selectedCollage);

  const navigate = useNavigate();

  const handleUploadCollage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      toastUploadCollage(visitorId, file);
      setTimeout(async () => {
        const newCollageList = await getUserCollageList(visitorId);
        setUserCollageList(newCollageList);
      }, 3000);
    }
  };

  const toggleCollageSelection = (path: string) => {
    setSelectedCollageList((prev) => {
      const newSet = new Set(prev);
      newSet[newSet.has(path) ? "delete" : "add"](path);
      return newSet;
    });
  };

  useEffect(() => {
    const fetchAllCollages = async () => {
      try {
        const [defaultCollages, userCollages, otherCollages] =
          await Promise.all([
            getDefaultCollageList(),
            getUserCollageList(visitorId),
            getOtherCollageList(visitorId),
          ]);

        setDefaultCollageList(defaultCollages);
        setUserCollageList(userCollages);
        setOtherCollageList(otherCollages);
      } catch (error) {
        console.error("Failed to fetch collages:", error);
      }
    };

    fetchAllCollages();
  }, [visitorId]);

  return (
    <>
      <Toaster />
      <main className="relative py-8 pl-24 pr-48">
        <button
          disabled={selectedCollageList.size === 0}
          className={clsx(
            "fixed bottom-12 right-8 flex flex-col items-center justify-center whitespace-pre-wrap rounded-full px-12 py-2 text-white  transition-transform active:scale-95",
            selectedCollageList.size > 0 ? "bg-[#E8ACAC]" : "bg-[#E8ACAC]/50"
          )}
          onClick={() => {
            setSelectedCollage(selectedCollageList);
            navigate("/work-create");
          }}
        >
          <span className="text-2xl font-bold">次へ</span>
          <span className="font-serif">NEXT</span>
          <span
            className={clsx(
              "absolute top-0 -translate-y-full font-bold",
              selectedCollageList.size > 0
                ? "text-[#D0BCBC]"
                : "text-[#D0BCBC]/50"
            )}
          >
            {`${selectedCollageList.size}個を選んだ`}
          </span>
        </button>
        <h1 className="text-2xl font-bold">コラージュリスト</h1>
        <h2 className="pb-4 pt-12 text-xl font-bold text-[#AE8A91]">
          自分のコラージュ
        </h2>
        <div className="relative flex flex-wrap gap-x-16 gap-y-12">
          {userCollageList.map((collage) => (
            <CollageItem
              key={collage.name}
              collage={collage}
              isSelected={selectedCollageList.has(collage.path)}
              onToggle={toggleCollageSelection}
            />
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
          {otherCollageList.map((collage) => (
            <CollageItem
              key={collage.path}
              collage={collage}
              prefix={collage.path.split("/")[1].slice(0, 4)}
              isSelected={selectedCollageList.has(collage.path)}
              onToggle={toggleCollageSelection}
            />
          ))}
          {defaultCollageList.map((collage) => (
            <CollageItem
              key={collage.path}
              collage={collage}
              isSelected={selectedCollageList.has(collage.path)}
              onToggle={toggleCollageSelection}
            />
          ))}
        </div>
      </main>
    </>
  );
}
