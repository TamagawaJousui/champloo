import clsx from "clsx";
import { Outlet, useParams } from "react-router";

export default function Layout() {
  return (
    <>
      <div className="flex h-12 w-full items-center justify-center">
        <Tab tabName="コラージュを選ぶ" pathName="collage-select" />
        <Tab tabName="作品を作る" pathName="work-create" />
        <Tab tabName="作品リスト" pathName="work-list" />
      </div>
      <Outlet />
    </>
  );
}

const Tab = ({ tabName, pathName }: { tabName: string; pathName: string }) => {
  const { tab: path } = useParams();
  return (
    <div
      className={clsx(
        "flex h-full flex-1 items-center justify-center border border-[#AE8A91] bg-[#D0BCBC]/40 font-bold text-[#D0BCBC]",
        path === pathName && "bg-[#D0BCBC]/100 text-white"
      )}
    >
      {tabName}
    </div>
  );
};
