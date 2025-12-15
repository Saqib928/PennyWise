export function MemberPicker({ members, selected, onSelect }: any) {
  return (
    <div className="flex gap-2 flex-wrap">
      {members.map((m: any) => (
        <button
          key={m.id}
          onClick={() => onSelect(m)}
          className={`px-3 py-1 rounded-lg border ${selected.includes(m.id) ? "bg-black text-white" : ""}`}
        >
          {m.name}
        </button>
      ))}
    </div>
  );
}
