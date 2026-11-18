import { Plus } from "lucide-react";

export default function EventHeaderSection({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-3">
      <h1 className="text-base font-bold text-[#4A342A]">Event Terdekat:</h1>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex h-8 items-center gap-2 rounded-md bg-[#4A291F] px-3 text-[10px] font-semibold text-white shadow-sm hover:bg-[#633A2D]"
      >
        <Plus size={14} aria-hidden="true" />
        Tambah Event
      </button>
    </header>
  );
}
