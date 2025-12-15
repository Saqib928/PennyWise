export function SplitRow({ name, amount, isPaid }: any) {
  return (
    <div className="flex justify-between py-2 border-b">
      <span>{name}</span>
      <span className={isPaid ? "text-green-600" : "text-red-600"}>
        ₹{amount} {isPaid ? "(Paid)" : "(Pending)"}
      </span>
    </div>
  );
}
