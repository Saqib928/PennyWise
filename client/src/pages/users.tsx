export default function Users() {
  const users = [
    { id: "1", name: "Saqib", country: "India", age: 21 },
    { id: "2", name: "Ali", country: "Pakistan", age: 24 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users</h1>

      <div className="grid gap-4">
        {users.map((u) => (
          <div key={u.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <p className="font-semibold">{u.name}</p>
            <p className="text-gray-600 text-sm">{u.country}</p>
            <p className="text-gray-600 text-sm">Age: {u.age}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
