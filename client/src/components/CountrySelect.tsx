import { useState, useRef, useEffect } from "react";
import countries from "../data/countries.json";

export default function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = countries.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* INPUT */}
      <input
        value={open ? query : value}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onClick={() => setOpen(true)}
        placeholder="Search or select country"
        className="w-full p-2 border rounded-lg"
      />

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute left-0 w-full mt-1 bg-white border rounded-lg shadow-lg 
            z-50 
            max-h-60   /* LIMIT HEIGHT (~15 items) */
            overflow-y-auto  /* SCROLL INSIDE DROPDOWN */
            overflow-x-hidden
          "
        >
          {filtered.length === 0 && (
            <p className="p-2 text-sm text-gray-500">No country found</p>
          )}

          {filtered.map((c) => (
            <div
              key={c}
              onClick={() => {
                onChange(c);
                setQuery("");
                setOpen(false);
              }}
              className="
                p-2 cursor-pointer hover:bg-gray-100 
                text-sm truncate
              "
            >
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
