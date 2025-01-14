import { useIdentityStore } from "@/store/userIdentityStore";
import { useState, useEffect } from "react";
import { getUserWorkList, getOtherWorkList } from "@/firebase/storage";
import WorkItem from "@/component/WorkItem";
import { Collage } from "@/model/Collage";

export default function WorkList() {
  const { visitorId } = useIdentityStore();

  const [userWorkList, setUserWorkList] = useState<Collage[]>([]);
  const [otherWorkList, setOtherWorkList] = useState<Collage[]>([]);

  useEffect(() => {
    const fetchAllWorks = async () => {
      const [userWorks, otherWorks] = await Promise.all([
        getUserWorkList(visitorId),
        getOtherWorkList(visitorId),
      ]);
      setUserWorkList(userWorks);
      setOtherWorkList(otherWorks);
    };

    fetchAllWorks();
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
            <WorkItem
              key={work.name}
              work={work}
              prefix={work.path.split("/")[1].slice(0, 4)}
            />
          ))}
        </div>
      </main>
    </>
  );
}
