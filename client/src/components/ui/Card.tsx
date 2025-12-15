export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 rounded-xl bg-white shadow ${className}`}>{children}</div>;
}
