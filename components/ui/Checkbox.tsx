import Image from "next/image";

export default function Checkbox({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: (val: boolean) => void;
}) {
  const toggleCheck = () => setChecked(!checked);
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input type="checkbox" onClick={toggleCheck} className="hidden peer" />
      <div className="w-5 h-5 border-2 border-gray-500 rounded-md flex items-center justify-center peer-checked:border-green-500 transition">
        {checked && (
          <Image
            src="/icons/checked.svg"
            width={10}
            height={10}
            alt="checked"
          />
        )}
      </div>
    </label>
  );
}
