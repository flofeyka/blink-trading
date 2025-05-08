import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className }: Props) {
  return (
    <div className={`rounded-md bg-[#202020] p-5 ${className}`}>{children}</div>
  );
}
