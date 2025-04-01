export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-md bg-[#202020] p-5 ${className}`}>{children}</div>
  );
}
