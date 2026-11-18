import { Star, X } from "lucide-react";

export default function RatingDialogSection({
  isOpen,
  onClose,
  rating,
  submitted,
  onRatingChange,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  rating: number;
  submitted: boolean;
  onRatingChange: (rating: number) => void;
  onSubmit: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#211711]/65 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-heading"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[420px] rounded-[8px] bg-[#fbf7ee] p-5 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9b3d32]">
              Masukan pengunjung
            </p>
            <h2 id="rating-heading" className="mt-1 text-xl font-extrabold">
              Bagaimana pengalamanmu?
            </h2>
          </div>
          <button
            type="button"
            aria-label="Tutup rating"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[#51473d]"
          >
            <X size={20} />
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[#71665b]">
          Bagikan penilaianmu untuk membantu kami merawat pengalaman di Kampung
          Budaya Polowijen.
        </p>
        <div className="mt-5 flex items-center gap-2" aria-label="Pilih rating">
          {[1, 2, 3, 4, 5].map((ratingValue) => (
            <button
              key={ratingValue}
              type="button"
              aria-label={`${ratingValue} dari 5 bintang`}
              aria-pressed={rating === ratingValue}
              onClick={() => onRatingChange(ratingValue)}
              className="p-1 text-[#c49a4a]"
            >
              <Star
                size={28}
                fill={ratingValue <= rating ? "currentColor" : "none"}
                strokeWidth={1.8}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={rating === 0}
          onClick={onSubmit}
          className="mt-5 w-full rounded-[6px] bg-[#9b3d32] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Kirim rating
        </button>
        {submitted && (
          <p role="status" className="mt-3 text-sm font-semibold text-[#315642]">
            Terima kasih atas penilaianmu.
          </p>
        )}
      </section>
    </div>
  );
}
