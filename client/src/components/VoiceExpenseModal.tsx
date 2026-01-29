import { useEffect, useState } from "react";
import { Mic, StopCircle, RefreshCw, Loader2, X } from "lucide-react";

import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import { voiceExpense } from "../services/ai.service";
import { GroupService } from "../services/groups.service";
import { ExpenseService } from "../services/expenses.service";

export function VoiceExpenseModal({ isOpen, onClose, onExpenseAdded }: any) {

  const {
    recording,
    audioBlob,
    startRecording,
    stopRecording,
    reset
  } = useVoiceRecorder();

  const [groups, setGroups] = useState<any[]>([]);
  const [manualText, setManualText] = useState("");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [groupId, setGroupId] = useState("");

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load groups
  useEffect(() => {
    if (!isOpen) return;

    GroupService.getAll().then(res => {
      const list = res.data.groups || res.data.data || [];
      setGroups(list);

      if (list.length) {
        setGroupId(list[0]._id || list[0].id);
      }
    });

    startRecording();

  }, [isOpen]);

  // When audio ready → send to backend
  useEffect(() => {
    if (!audioBlob) return;
    processAudio();
  }, [audioBlob]);

  async function processAudio() {
    setProcessing(true);

    try {
      const result = await voiceExpense(audioBlob!);

      setManualText(result.rawText);
      setDescription(result.parsed.title || "");
      setAmount(result.parsed.amount?.toString() || "");

    } catch {
      alert("Voice processing failed");
    }

    setProcessing(false);
  }

  async function confirmExpense() {
    if (!description || !amount || !groupId) return;

    setLoading(true);

    try {
      const selected = groups.find(g => (g._id || g.id) === groupId);
      const members = selected?.members || [];

      const splitAmount = Number(amount) / (members.length || 1);

      const splits = members.map((m: any) => ({
        userId: m._id || m.id,
        amount: splitAmount
      }));

      await ExpenseService.create({
        productName: description,
        price: Number(amount),
        category: "Voice",
        groupId,
        splits
      });

      onExpenseAdded();
      closeModal();

    } catch {
      alert("Expense creation failed");
    }

    setLoading(false);
  }

  function closeModal() {
    stopRecording();
    reset();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">

      <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-6">

        <div className="flex justify-between">
          <h2 className="font-bold text-xl">
            {recording ? "Listening..." : "Review Expense"}
          </h2>
          <button onClick={closeModal}>
            <X />
          </button>
        </div>

        <textarea
          value={manualText}
          onChange={e => setManualText(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <div className="flex justify-center gap-3">
          {recording ? (
            <button onClick={stopRecording} className="bg-red-100 px-4 py-2 rounded-full flex gap-2">
              <StopCircle /> Stop
            </button>
          ) : (
            <button onClick={startRecording} className="bg-indigo-100 px-4 py-2 rounded-full flex gap-2">
              <RefreshCw /> Record Again
            </button>
          )}
        </div>

        {processing && (
          <div className="text-center text-gray-500 text-sm">
            Processing voice...
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">

          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Expense"
            className="border p-2 rounded"
          />

          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
            className="border p-2 rounded"
          />

          <select
            value={groupId}
            onChange={e => setGroupId(e.target.value)}
            className="col-span-2 border p-2 rounded"
          >
            {groups.map(g => (
              <option key={g._id || g.id} value={g._id || g.id}>
                {g.name}
              </option>
            ))}
          </select>

        </div>

        <button
          onClick={confirmExpense}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl flex justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Confirm Expense"}
        </button>

      </div>
    </div>
  );
}
