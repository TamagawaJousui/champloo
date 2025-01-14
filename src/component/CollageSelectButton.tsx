import clsx from "clsx";

export default function SelectButton({
  isSelected,
  onClick,
}: {
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={clsx(
        "size-5 cursor-pointer rounded-full border border-[#E79292] transition-colors",
        isSelected ? "bg-[#E79292]" : "bg-white"
      )}
      onClick={onClick}
    >
      {isSelected && (
        <svg
          className="size-full scale-150 p-1 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            d="M4 13l5 5L20 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
