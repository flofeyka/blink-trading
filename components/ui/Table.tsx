import {ReactNode, useEffect, useRef, useState} from "react";
import Image from "next/image";
import SortArrows, {SortDirection} from "./SortArrows";

export interface Column<T> {
  header: string | ReactNode;
  key: keyof T;
  align?: "left" | "right" | "center";
  icon?: string;
  render?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  minWidth?: string;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  rowClassName?: string;
  headerClassName?: string;
  textColor?: string;
  onSort?: (key: keyof T, direction: SortDirection) => void;
}

export default function Table<T>({
  data,
  columns,
  className = "",
  rowClassName = "",
  headerClassName = "",
  textColor,
  onSort,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: SortDirection;
  }>({
    key: null,
    direction: null,
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [hasHorizontalOverflow, setHasHorizontalOverflow] = useState(false);
  const [autoWidthColumns, setAutoWidthColumns] = useState(0);
  const [autoColumnWidth, setAutoColumnWidth] = useState("auto");

  // Calculate auto column widths
  useEffect(() => {
    const columnsWithoutWidth = columns.filter(
      (col) => !col.width && !col.minWidth
    ).length;
    setAutoWidthColumns(columnsWithoutWidth);

    if (columnsWithoutWidth > 0) {
      setAutoColumnWidth(`${100 / columnsWithoutWidth}%`);
    }
  }, [columns]);

  // Check for horizontal overflow
  useEffect(() => {
    const checkOverflow = () => {
      if (tableContainerRef.current) {
        const { scrollWidth, clientWidth } = tableContainerRef.current;
        setHasHorizontalOverflow(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [data, columns]);

  const handleSort = (column: Column<T>, direction: SortDirection) => {
    if (!column.sortable) return;

    const newConfig = {
      key: column.key,
      direction,
    };

    setSortConfig(newConfig);

    if (onSort) {
      onSort(column.key, direction);
    }
  };

  // Set a default minimum width for columns without specified width
  const defaultMinWidth = "120px";

  // Add extra padding for sortable columns to accommodate the sort arrows
  const getSortablePadding = (column: Column<T>) => {
    return column.sortable ? "pr-6" : "";
  };

  return (
    <div className="w-full relative overflow-hidden">
      <div
        ref={tableContainerRef}
        className="w-full overflow-x-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#444 #222",
        }}
      >
        <table
          className={`${className} w-full`}
          style={{
            tableLayout: "fixed",
            borderCollapse: "separate",
            borderSpacing: "0",
          }}
        >
          <colgroup>
            {columns.map((column, index) => (
              <col
                key={`col-${index}`}
                style={{
                  minWidth: column.sortable
                    ? `calc(${column.minWidth || defaultMinWidth} + 24px)`
                    : column.minWidth || defaultMinWidth,
                  width:
                    column.width ||
                    (column.minWidth ? column.minWidth : autoColumnWidth),
                }}
              />
            ))}
          </colgroup>
          <thead className={`text-[#A9A9A9] pb-3 text-sm ${headerClassName}`}>
            <tr>
              {columns.map((column, index) => {
                const alignClass =
                  column.align === "right"
                    ? "text-right"
                    : column.align === "center"
                    ? "text-center"
                    : "text-left";

                const sortableClass = getSortablePadding(column);

                return (
                  <th
                    key={index}
                    className={`font-normal pb-2 whitespace-nowrap px-2 ${alignClass} ${sortableClass} relative`}
                    style={{
                      minWidth: column.sortable
                        ? `calc(${column.minWidth || defaultMinWidth} + 24px)`
                        : column.minWidth || defaultMinWidth,
                      width:
                        column.width ||
                        (column.minWidth ? column.minWidth : autoColumnWidth),
                    }}
                  >
                    <div
                      className={`flex items-center gap-0.5 ${
                        column.sortable ? "mr-8" : ""
                      }`}
                    >
                      <span>{column.header}</span>
                      {column.icon ? (
                        <Image
                          src={column.icon}
                          width={20}
                          height={20}
                          alt={`${column.header} icon`}
                          className="cursor-pointer"
                        />
                      ) : null}
                    </div>

                    {column.sortable && (
                      <div className="absolute right-2 top-0 bottom-0 flex items-end">
                        <SortArrows
                          initialDirection={
                            column.key === sortConfig.key
                              ? sortConfig.direction
                              : null
                          }
                          onSortChange={(direction) =>
                            handleSort(column, direction)
                          }
                        />
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`text-sm border-b border-[#353535] hover:bg-[#2c2c2c] transition-all duration-300 ${row && typeof row === "object" && 'color' in row && row?.color && `text-${row?.color}`} ${rowClassName}`}
              >
                {columns.map((column, colIndex) => {
                  const alignClass =
                    column.align === "right"
                      ? "text-right"
                      : column.align === "center"
                      ? "text-center"
                      : "text-left";

                  const sortableClass = getSortablePadding(column);

                  return (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className={`py-3 px-2 ${alignClass} ${sortableClass}`}
                      style={{
                        minWidth: column.sortable
                          ? `calc(${column.minWidth || defaultMinWidth} + 24px)`
                          : column.minWidth || defaultMinWidth,
                        width:
                          column.width ||
                          (column.minWidth ? column.minWidth : autoColumnWidth),
                      }}
                    >
                      {column.render ? (
                        column.render(row[column.key], row)
                      ) : textColor ? (
                        <span className={`text-[${textColor}]`}>
                          {String(row[column.key])}
                        </span>
                      ) : (
                        String(row[column.key])
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        /* Custom scrollbar styles for webkit browsers */
        div::-webkit-scrollbar {
          height: 6px;
        }
        div::-webkit-scrollbar-track {
          background: #222;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
