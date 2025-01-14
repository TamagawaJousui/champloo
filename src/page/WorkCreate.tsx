import { storage } from "@/firebase/firebse";
import { ref, getDownloadURL } from "firebase/storage";
import { useSelectedCollageStore } from "@/stores/selectedCollageStore";
import { useEffect, useState } from "react";

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
  console.log(collageUrls);
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
  return (
    <>
      <main>
        {collageList.map((collage) => (
          <div key={collage.name}>
            <img src={collage.url} alt={collage.name} className="size-32" />
          </div>
        ))}
      </main>
    </>
  );
}
