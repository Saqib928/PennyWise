import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [searchUser, setSearchUser] = useState("");

  const allUsers = ["Saqib", "Ali", "John", "Sarah", "Michael"];

  const filteredUsers = allUsers.filter((u) =>
    u.toLowerCase().includes(searchUser.toLowerCase())
  );

  const addMember = (user: string) => {
    if (!members.includes(user)) {
      setMembers([...members, user]);
    }
  };

  const createGroup = () => {
    if (!groupName.trim()) return alert("Group name required!");

    console.log({
      groupName,
      members,
    });

    alert("Group created! (Implement backend here)");
    navigate("/groups");
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold">Create New Group</h1>

      {/* Group Name */}
      <input
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {/* Search & Add Users */}
      <div className="border p-3 rounded">
        <p className="font-semibold">Add Members</p>

        <input
          placeholder="Search user..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />

        <div className="mt-2 max-h-32 overflow-y-auto">
          {filteredUsers.map((u) => (
            <p
              key={u}
              onClick={() => addMember(u)}
              className="p-2 cursor-pointer hover:bg-gray-100 rounded"
            >
              {u}
            </p>
          ))}
        </div>

        {/* Selected members box */}
        <div className="mt-2 flex flex-wrap gap-2">
          {members.map((m) => (
            <span key={m} className="px-3 py-1 bg-black text-white rounded">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={createGroup}
        className="w-full py-2 bg-black text-white rounded"
      >
        Create Group
      </button>
    </div>
  );
}
