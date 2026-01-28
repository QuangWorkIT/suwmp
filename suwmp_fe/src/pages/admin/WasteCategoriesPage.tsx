import { useEffect, useState, type JSX } from "react";
import AddWasteCategoryModal from "./AddWasteCategoryModal";

import {
  Recycle,
  Leaf,
  Monitor,
  AlertTriangle,
  Flame,
  Plus,
} from "lucide-react";

type WasteType = {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};

const ICON_MAP: Record<string, JSX.Element> = {
  RECYCLABLE: <Recycle className="text-white" />,
  ORGANIC: <Leaf className="text-white" />,
  HAZARDOUS: <AlertTriangle className="text-white" />,
  ELECTRONIC: <Monitor className="text-white" />,
  ENERGY: <Flame className="text-white" />,
};

const COLOR_MAP: Record<string, string> = {
  RECYCLABLE: "bg-blue-500",
  ORGANIC: "bg-green-500",
  HAZARDOUS: "bg-red-500",
  ELECTRONIC: "bg-purple-500",
  ENERGY: "bg-orange-500",
};

const WasteCategoriesPage = () => {
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/admin/waste-types");
        if (!res.ok) throw new Error("Failed to load waste types");
        setWasteTypes(await res.json());
      } catch (err) {
        setError("Unable to load waste categories");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* States */}
      {loading && <p className="text-gray-500">Loading waste categories...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wasteTypes.map((wt) => {
              const icon = ICON_MAP[wt.name] ?? (
                <Recycle className="text-white" />
              );
              const color = COLOR_MAP[wt.name] ?? "bg-gray-400";

              return (
                <div
                  key={wt.id}
                  className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
                    >
                      {icon}
                    </div>

                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                      Active
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {wt.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {wt.description ?? "No description"}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Add custom type */}
            <button
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed 
          border-purple-300 bg-white p-6 text-purple-600 hover:bg-purple-50 transition cursor-pointer"
              onClick={() => setOpenModal(true)}
            >
              <Plus size={32} />
              <span className="mt-2 font-medium">Add Custom Type</span>
            </button>
          </div>

          <AddWasteCategoryModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onCreated={(newType) => setWasteTypes((prev) => [...prev, newType])}
          />
        </>
      )}
    </div>
  );
};

export default WasteCategoriesPage;
