import { useState } from "react";

export default function Notifications() {
  const [requests] = useState([
    {
      id: "1",
      group: "Goa Trip",
      from: "Saqib",
      type: "Group Join Request",
    },
  ]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-3">
          {requests.map((n) => (
            <div key={n.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <p className="font-semibold">{n.type}</p>
              <p className="text-gray-600 text-sm">
                {n.from} invited you to join <b>{n.group}</b>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
