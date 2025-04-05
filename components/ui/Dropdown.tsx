"use client";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import Image from "next/image";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  dropdownClassName?: string;
  align?: "left" | "right";
  width?: string;
}

export default function Dropdown({
  trigger,
  children,
  className = "",
  dropdownClassName = "",
  align = "left",
  width = "235px",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
        onClick={toggleDropdown}
      >
        {trigger}
      </div>

      <div
        className={`absolute z-50 mt-2 shadow-2xl shadow-black bg-[#202020] rounded-md overflow-hidden transition-all duration-200 ${
          align === "right" ? "right-10" : "left-0"
        } ${dropdownClassName} origin-top-${
          align === "right" ? "right" : "left"
        } ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
        style={{ width }}
      >
        {children}
      </div>
    </div>
  );
}

export function DropdownItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`px-2 rounded-md text-white transition-all duration-150 flex flex-col py-1 justify-center text-sm hover:bg-[#353535] hover:pl-3 cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownDivider() {
  return <div className="border-t border-[#353535] my-1"></div>;
}
