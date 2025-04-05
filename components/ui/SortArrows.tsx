import { useState } from "react";
import Image from "next/image";

export type SortDirection = "asc" | "desc" | null;

interface SortArrowsProps {
  onSortChange?: (direction: SortDirection) => void;
  initialDirection?: SortDirection;
  className?: string;
}

export default function SortArrows({
  onSortChange,
  initialDirection = null,
  className = "",
}: SortArrowsProps) {
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(initialDirection);

  const handleSortClick = (direction: SortDirection) => {
    // If clicking the same direction, clear the sort
    const newDirection = sortDirection === direction ? null : direction;
    setSortDirection(newDirection);
    onSortChange?.(newDirection);
  };

  return (
    <div className={`flex flex-col -space-y-3 ${className}`}>
      <button
        onClick={() => handleSortClick("asc")}
        className="w-6 h-6 flex items-center justify-center cursor-pointer"
        aria-label="Sort ascending"
      >
        <Image
          src="/icons/arrow-right.svg"
          width={22}
          height={22}
          alt="Sort ascending"
          className={`transform -rotate-90 ${
            sortDirection === "asc" ? "brightness-200" : ""
          }`}
        />
      </button>
      <button
        onClick={() => handleSortClick("desc")}
        className="w-6 h-6 flex items-center justify-center cursor-pointer"
        aria-label="Sort descending"
      >
        <Image
          src="/icons/arrow-right.svg"
          width={22}
          height={22}
          alt="Sort descending"
          className={`transform rotate-90 ${
            sortDirection === "desc" ? "brightness-200" : ""
          }`}
        />
      </button>
    </div>
  );
}
