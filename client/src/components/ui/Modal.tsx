export function Modal({ open, onClose, children }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative">
        <button className="absolute top-3 right-3" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>
  );
}
