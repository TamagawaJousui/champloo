import { storage } from "@/firebase/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useIdentityStore } from "@/store/userIdentityStore";
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

const getOtherWorkList = async (visitorId: string) => {
  const workFolderRef = ref(storage, `works`);
  const res = await listAll(workFolderRef);

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

export default function WorkList() {
  const { visitorId } = useIdentityStore();

  const [userWorkList, setUserWorkList] = useState<
    Array<{ name: string; url: string; path: string }>
  >([]);
  const [otherWorkList, setOtherWorkList] = useState<
    Array<{ name: string; url: string; path: string }>
  >([]);

  // Add new WorkItem component
  const WorkItem = ({
    work,
  }: {
    work: { name: string; url: string; path: string };
  }) => {
    // 从 path 中提取用户 ID，并只取前4位
    const userId = work.path.split("/")[1].slice(0, 4);
    const fileName = work.name.replace(".jpeg", "");

    return (
      <div key={work.name}>
        <img
          src={work.url}
          alt={work.name}
          className="size-36 cursor-pointer"
        />
        <div className="flex items-center justify-between pt-3">
          <p>
            {userId === visitorId.slice(0, 4)
              ? fileName
              : `${userId}-${fileName}`}
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchUserWorks = async () => {
      const works = await getUserWorkList(visitorId);
      setUserWorkList(works);
    };

    const fetchOtherWorks = async () => {
      const works = await getOtherWorkList(visitorId);
      setOtherWorkList(works);
    };

    fetchUserWorks();
    fetchOtherWorks();
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
          他人の作品
        </h2>
        <div className="flex flex-wrap gap-x-16 gap-y-12">
          {otherWorkList.map((work) => (
            <WorkItem key={work.name} work={work} />
          ))}
        </div>
      </main>
    </>
  );
}
