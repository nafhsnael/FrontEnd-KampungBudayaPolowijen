import { Heart } from "lucide-react";
import { useRouter } from "next/router";
import UMKMPage from "@/pages/UMKMPage";

export default function UserUMKMPage() {
	const router = useRouter();

	return (
		<main className="relative flex min-h-screen w-full items-start justify-center overflow-x-hidden bg-[#FDF8F2] font-sans text-stone-800">
			<button
				type="button"
				onClick={() => void router.push("/user/favorite")}
				aria-label="Buka produk favorit"
				className="fixed right-5 top-5 z-50 rounded-full border border-[#ead7b8] bg-[#FDF8F2] p-3 text-[#9B3D32] shadow-md transition hover:bg-[#9B3D32] hover:text-[#FDF8F2]"
			>
				<Heart size={20} />
			</button>
			<div className="mx-auto w-full max-w-350 space-y-6 px-4 pb-28 pt-4 sm:px-8 md:px-12 [&>main]:min-h-0! [&>main]:w-full! [&>main]:bg-transparent! [&>main]:p-0! [&>main>div]:static! [&>main>div]:h-auto! [&>main>div]:max-h-none! [&>main>div]:min-h-0! [&>main>div]:max-w-none! [&>main>div]:rounded-none! [&>main>div]:border-0! [&>main>div]:bg-transparent! [&>main>div]:p-0! [&>main>div]:shadow-none! [&_.mt-4.grid]:grid-cols-2 sm:[&_.mt-4.grid]:grid-cols-3 md:[&_.mt-4.grid]:grid-cols-4">
				<UMKMPage />
			</div>
		</main>
	);
}
