import Tab from "@/component/Tab";
import { Outlet } from "react-router";

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
