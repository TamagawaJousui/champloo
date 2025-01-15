export default function LoadingSpinner() {
  return (
    <div className="flex size-36 flex-col items-center justify-center gap-4">
      <div className="size-8 animate-spin rounded-full border-4 border-[#E8ACAC] border-t-transparent" />
      <div className="text-[#E8ACAC]">Loading</div>
    </div>
  );
}
