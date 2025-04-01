import { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <input
        className={`bg-[#353535] rounded-[20px] placeholder:text-[#716F7A] placeholder:text-[12px] ${props.className}`}
        {...props}
      />
    </div>
  );
}
