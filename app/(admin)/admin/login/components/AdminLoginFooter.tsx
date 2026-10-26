import Link from "next/link";

export default function AdminLoginFooter() {
  return (
    <footer className="mt-6 border-t border-amber-900/40 pt-4 text-center">
      <p className="text-sm text-stone-300">
        Bukan admin?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#D4A359] hover:underline"
        >
          Login sebagai pengguna
        </Link>
      </p>
    </footer>
  );
}
