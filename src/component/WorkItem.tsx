export default function WorkItem({
  work,
  prefix,
}: {
  work: { name: string; url: string; path: string };
  prefix?: string;
}) {
  let name = work.name.replace(".jpeg", "");
  if (prefix) {
    name = `${prefix}-${name}`;
  }

  return (
    <div key={work.name}>
      <img src={work.url} alt={work.name} className="size-36 cursor-pointer" />
      <div className="flex items-center justify-between pt-3">
        <p>{name}</p>
      </div>
    </div>
  );
}
