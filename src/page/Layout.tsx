import clsx from "clsx";
import { Outlet, useLocation, useNavigate } from "react-router";

export default function Layout() {
  return (
    <>
      <header>
        <div className="flex h-12 w-full items-center justify-center">
          <Tab tabName="コラージュを選ぶ" pathName="collage-select" />
          <Tab tabName="作品を作る" pathName="work-create" />
          <Tab tabName="作品リスト" pathName="work-list" />
        </div>
      </header>
      <Outlet />
    </>
  );
}

const Tab = ({ tabName, pathName }: { tabName: string; pathName: string }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <div
      className={clsx(
        "flex h-full flex-1 items-center justify-center border border-[#AE8A91]  font-bold ",
        pathname.replace("/", "") === pathName
          ? "bg-[#D0BCBC]/100 text-white"
          : "bg-[#D0BCBC]/40 text-[#D0BCBC]"
      )}
      onClick={() => {
        navigate(pathName);
      }}
    >
      {tabName}
    </div>
  );
};
