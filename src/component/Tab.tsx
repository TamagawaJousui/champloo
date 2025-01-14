import clsx from "clsx";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";

export default function Tab({
  tabName,
  pathName,
}: {
  tabName: string;
  pathName: string;
}) {
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
}
