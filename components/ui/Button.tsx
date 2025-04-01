import { ButtonHTMLAttributes } from "react";

export default function Button({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-linear-to-r from-[#92d503] to-[#02ba89] px-5 rounded-3xl text-[13px] text-white p-2 font-bold cursor-pointer ${props.className}`}
    >
      {children}
    </button>
  );
}
