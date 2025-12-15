import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Group {
  id: string;
  name: string;
  members: number;
  totalExpense: number;
}

interface User {
  id: string;
  name: string;
}

export default function Groups() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState<Group[]>([
    { id: "1", name: "Goa Trip", members: 4, totalExpense: 12500 },
    { id: "2", name: "Flat Expenses", members: 3, totalExpense: 8000 },
  ]);

  const [users] = useState<User[]>([
    { id: "1", name: "Saqib" },
    { id: "2", name: "Aman" },
    { id: "3", name: "Ali" }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert("Enter group name!");
      return;
    }

    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: groupName,
      members: selectedUsers.length + 1,
      totalExpense: 0,
    };

    setGroups([newGroup, ...groups]);

    console.log("SEND GROUP INVITE TO USERS:", selectedUsers);

    setGroupName("");
    setSelectedUsers([]);
    setIsModalOpen(false);

    // redirect to newly created group
    navigate(`/groups/${newGroup.id}`);
  };

  return (
    <div className="space-y-4">
      {/* TOP HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Groups</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          + New Group
        </button>
      </div>

      {/* GROUP LIST */}
      <div className="grid gap-4">
        {groups.map(group => (
          <Link
            key={group.id}
            to={`/groups/${group.id}`}
            className="p-4 border rounded-lg hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg">{group.name}</h2>
            <p className="text-gray-600">
              {group.members} members • ₹{group.totalExpense}
            </p>
          </Link>
        ))}
      </div>

      {/* ---------- CREATE GROUP MODAL ---------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Group</h2>

            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full p-2 border rounded-lg mb-4"
            />

            <p className="font-medium mb-2">Add Members (send request)</p>

            <div className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded-lg">
              {users.map(user => (
                <label key={user.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                  />
                  {user.name}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateGroup}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
