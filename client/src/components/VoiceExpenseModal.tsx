import { useState, useEffect } from "react";
import { Mic, X, Check, Loader2, StopCircle, RefreshCw, Wand2 } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { GroupService } from "../services/groups.service";
import { ExpenseService } from "../services/expenses.service";
import type { Group } from "../types/group.types";

interface VoiceExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded: () => void;
}

export function VoiceExpenseModal({ isOpen, onClose, onExpenseAdded }: VoiceExpenseModalProps) {
  const { isListening, transcript, error, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  
  const [groups, setGroups] = useState<Group[]>([]);
  
  // UI State
  const [manualText, setManualText] = useState(""); // The editable text box
  
  // Parsed Form Data
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Init: Fetch groups & Start Listening
  useEffect(() => {
    if (isOpen) {
        setManualText("");
        setDescription("");
        setAmount("");
        
        GroupService.getAll().then((res) => {
            const list = res.data.groups || res.data.data || [];
            if (Array.isArray(list)) {
                setGroups(list as Group[]);
                if (list.length > 0) setSelectedGroupId((list[0] as any)._id || (list[0] as any).id || "");
            }
        });

        // Small delay to ensure UI is ready
        setTimeout(() => startListening(), 300);
    } else {
        stopListening();
        resetTranscript();
    }
  }, [isOpen]);

  // 2. Sync Hook Transcript with Manual Text Box
  // We allow the user to edit 'manualText', but we append new speech 'transcript' 
  // Note: This is a simple sync. For complex editing while speaking, logic needs to be fancier.
  // Here we just overwrite with transcript if listening, or let user type.
  useEffect(() => {
    if (isListening && transcript) {
        setManualText(transcript);
    }
  }, [transcript, isListening]);

  // 3. Auto-Analyze when listening stops or text changes
  useEffect(() => {
    if (manualText) {
        analyzeText(manualText);
    }
  }, [manualText]);

  const analyzeText = (text: string) => {
    // Regex to find the *last* number in the string usually works best for "Burger for 200"
    // But "200 for Burger" also happens. Let's try to find the largest number or distinct number.
    
    const numbers = text.match(/(\d+)(\.\d{1,2})?/g);
    let detectedPrice = "";
    
    if (numbers && numbers.length > 0) {
        // Simple heuristic: Assume the distinct number is the price
        detectedPrice = numbers[0]; 
    }

    // Remove the price and keywords from text to get description
    const detectedDesc = text
        .replace(detectedPrice, "")
        .replace(/rupees|rs|expense|for/gi, "")
        .trim();

    setDescription(detectedDesc);
    setAmount(detectedPrice);
  };

  const handleConfirm = async () => {
    if (!selectedGroupId || !amount || !description) {
        alert("Please ensure Description, Amount, and Group are filled.");
        return;
    }
    
    setLoading(true);
    try {
        const selectedGroup = groups.find(g => ((g as any)._id || (g as any).id) === selectedGroupId);
        const members = selectedGroup?.members || [];
        
        const splitAmount = parseFloat(amount) / (members.length || 1);
        const splits = members.map((m: any) => ({
            userId: m._id || m.id,
            amount: splitAmount
        }));

        await ExpenseService.create({
            productName: description,
            price: parseFloat(amount),
            category: "Voice",
            groupId: selectedGroupId,
            splits: splits
        });

        onExpenseAdded();
    } catch (err) {
        alert("Failed to add expense");
    } finally {
        setLoading(false);
    }
  };

  const handleRestart = () => {
      setManualText("");
      setDescription("");
      setAmount("");
      startListening();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4 transition-all">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative flex flex-col animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-start">
            <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    {isListening ? <Mic className="animate-pulse" /> : <Wand2 />} 
                    {isListening ? "Listening..." : "Review Details"}
                </h3>
                <p className="text-indigo-100 text-sm mt-1 opacity-90">
                    {isListening ? "Say ex: 'Pizza 500' or 'Cab 200'" : "Edit the details below if needed."}
                </p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6">
            
            {/* Real-time Text Box */}
            <div className="relative">
                <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Listening... (or type here)"
                    className={`w-full p-4 text-xl font-medium text-gray-800 bg-gray-50 border-2 rounded-2xl focus:outline-none resize-none transition-all ${isListening ? 'border-indigo-400 shadow-indigo-100 shadow-lg' : 'border-gray-100'}`}
                    rows={2}
                />
                {isListening && (
                    <div className="absolute bottom-3 right-3">
                        <span className="flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                    <span className="font-bold">Error:</span> {error}
                </div>
            )}

            {/* Controls (Stop / Restart) */}
            <div className="flex gap-3 justify-center">
                {isListening ? (
                    <button 
                        onClick={stopListening}
                        className="px-6 py-2 bg-red-50 text-red-600 rounded-full font-semibold hover:bg-red-100 flex items-center gap-2 transition-colors"
                    >
                        <StopCircle size={18} /> Stop Listening
                    </button>
                ) : (
                    <button 
                        onClick={handleRestart}
                        className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full font-semibold hover:bg-indigo-100 flex items-center gap-2 transition-colors"
                    >
                        <RefreshCw size={18} /> Restart Mic
                    </button>
                )}
            </div>

            <hr className="border-gray-100" />

            {/* Parsed Form Data */}
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Expense Name</label>
                    <input 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full text-lg font-semibold border-b border-gray-200 focus:border-indigo-500 outline-none py-1 text-gray-800"
                        placeholder="e.g. Pizza"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Amount</label>
                    <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full text-2xl font-bold border-b border-gray-200 focus:border-indigo-500 outline-none py-1 text-indigo-600"
                        placeholder="0"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Group</label>
                    <select 
                        value={selectedGroupId}
                        onChange={(e) => setSelectedGroupId(e.target.value)}
                        className="w-full text-base border-b border-gray-200 focus:border-indigo-500 outline-none py-2 bg-transparent font-medium"
                    >
                        {groups.map(g => (
                            <option key={(g as any)._id || (g as any).id} value={(g as any)._id || (g as any).id}>{g.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Final Action */}
            <button 
                onClick={handleConfirm}
                disabled={loading || !description || !amount}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Confirm & Add Expense"}
            </button>

        </div>
      </div>
    </div>
  );
}