import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export type WasteType = {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (wasteType: WasteType) => void;
};

export default function AddWasteCategoryModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:8080/api/admin/waste-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      console.log("Creating waste type:", {
        name,
        description,
      });

      if (!res.ok) {
        throw new Error("Failed to create waste category");
      }

      const data: WasteType = await res.json();
      onCreated(data);
      onClose();
      setName("");
      setDescription("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Add Waste Category</h2>

        {error && (
          <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label className="mb-1 block text-sm font-medium">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g. Construction Waste"
            />
          </div>

          <div>
            <Label className="mb-1 block text-sm font-medium">
              Description (optional)
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Saving..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
