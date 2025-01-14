import SelectButton from "./CollageSelectButton";
import { Collage } from "@/models/Collage";

export default function CollageItem({
  collage,
  isSelected,
  onToggle,
  prefix,
}: {
  collage: Collage;
  isSelected: boolean;
  onToggle: (path: string) => void;
  prefix?: string;
}) {
  
  let name = collage.name.replace(".png", "");
  if (prefix) {
    name = `${prefix}-${name}`;
  }

  return (
    <div key={collage.name}>
      <img
        src={collage.url}
        alt={collage.name}
        className="size-36 cursor-pointer"
        onClick={() => onToggle(collage.path)}
      />
      <div className="flex items-center justify-between pt-3">
        <p>{name}</p>
        <SelectButton
          isSelected={isSelected}
          onClick={() => onToggle(collage.path)}
        />
      </div>
    </div>
  );
}
