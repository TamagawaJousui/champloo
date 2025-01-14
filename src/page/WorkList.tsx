import { storage } from "@/firebase/firebase";
import { ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage";
import { useIdentityStore } from "@/stores/userIdentityStore";
import { useState, useEffect } from "react";

// User Work List
const getUserWorkList = async (visitorId: string) => {
  const visitorFolderRef = ref(storage, `works/${visitorId}`);
  const res = await listAll(visitorFolderRef);

  const fileUrls = await Promise.all(
    res.items.map(async (item) => {
      const url = await getDownloadURL(item);
      return {
        name: item.name,
        url: url,
        path: `works/${visitorId}/${item.name}`,
      };
    })
  );

  return fileUrls;
};

// Add new WorkItem component
const WorkItem = ({
  work,
}: {
  work: { name: string; url: string; path: string };
}) => (
  <div key={work.name}>
    <img src={work.url} alt={work.name} className="size-36 cursor-pointer" />
    <div className="flex items-center justify-between pt-3">
      <p>{work.name.replace(".jpeg", "")}</p>
    </div>
  </div>
);

export default function WorkList() {
  const { visitorId } = useIdentityStore();

  const [userWorkList, setUserWorkList] = useState<
    Array<{ name: string; url: string; path: string }>
  >([]);

  useEffect(() => {
    const fetchUserWorks = async () => {
      const works = await getUserWorkList(visitorId);
      setUserWorkList(works);
    };

    fetchUserWorks();
  }, [visitorId]);

  return (
    <>
      <main className="relative py-8 pl-24">
        <h1 className="text-2xl font-bold">作品リスト</h1>
        <h2 className="pb-4 pt-12 text-xl font-bold text-[#AE8A91]">
          自分の作品
        </h2>
        <div className="relative flex flex-wrap gap-x-16 gap-y-12">
          {userWorkList.map((work) => (
            <WorkItem key={work.name} work={work} />
          ))}
        </div>

        <h2 className="pb-4 pt-12 text-xl font-bold text-[#AE8A91]">
          他人のコラージュ
        </h2>
        <div className="flex flex-wrap gap-x-16 gap-y-12"></div>
      </main>
    </>
  );
}
