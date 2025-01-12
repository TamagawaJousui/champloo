import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <div className="w-full h-9 flex">
        <div>コラージュを選ぶ</div>
        <div>作品を作る</div>
        <div>作品リスト</div>
      </div>
      <Outlet />
    </>
  );
}
