import Image from "next/image";
import Link from "next/link";
import { AnchorHTMLAttributes, LinkHTMLAttributes, RefAttributes } from "react";

export default function NavLink({
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      href="#"
      className={`hover:bg-[#92d503]/20 hover:text-[#92d503] transition-all md:p-2 rounded-md max-md:flex max-md:justify-between ${props.className}`}
      {...props}
    >
      <span>{children}</span>
      <span className="md:hidden">
        <Image
          src="/icons/arrow-right.svg"
          width={25}
          height={25}
          alt="arrow"
        />
      </span>
    </Link>
  );
}
