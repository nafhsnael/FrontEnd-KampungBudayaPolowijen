import { FormEvent, useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const normalizedEmail = email.trim();

		if (!normalizedEmail || !password) {
			setError("Email dan password wajib diisi.");
			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
			setError("Masukkan alamat email yang valid.");
			return;
		}

		setError("");
		setIsLoading(true);
		localStorage.setItem("user_role", "admin");
		await router.push("/admin/dashboard");
	};

	return (
		<main className="flex min-h-screen w-full items-center justify-center bg-[#3D2018] p-0 text-[#FDF8F2] sm:p-6">
			<section className="flex min-h-screen w-full max-w-105 flex-col justify-center bg-[#5C362B]/90 p-8 shadow-2xl sm:min-h-0 sm:rounded-[28px] sm:border sm:border-amber-900/40">
				<header className="mb-8 text-center">
					<Image src="/images/logo2.png" alt="Logo Kampung Budaya Polowijen" width={80} height={80} className="mx-auto h-20 w-20 object-contain" />
					<h1 className="mt-4 font-serif text-3xl font-bold text-[#D4A359]">Login Admin</h1>
				</header>

				<form onSubmit={handleSubmit} className="space-y-4" noValidate>
					<label className="flex items-center gap-3 rounded-full bg-[#FDF8F2] px-4 py-2.5 text-[#5C362B] shadow-inner">
						<Mail size={18} aria-hidden="true" />
						<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" autoComplete="email" className="w-full bg-transparent text-sm text-[#5C362B] outline-none placeholder:text-stone-500" aria-label="Email" />
					</label>

					<label className="flex items-center gap-3 rounded-full bg-[#FDF8F2] px-4 py-2.5 text-[#5C362B] shadow-inner">
						<Lock size={18} aria-hidden="true" />
						<input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" autoComplete="current-password" className="w-full bg-transparent text-sm text-[#5C362B] outline-none placeholder:text-stone-500" aria-label="Password" />
						<button type="button" onClick={() => setShowPassword((visible) => !visible)} className="shrink-0 text-[#5C362B]" aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}>
							{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</label>

					<div className="flex items-center justify-between px-2 text-[11px] text-stone-300">
						<label className="flex items-center gap-2"><input type="checkbox" className="accent-[#C49A4A]" /><span>Ingat saya</span></label>
						<button type="button" className="transition-colors hover:text-amber-300">Lupa password</button>
					</div>

					{error && <p className="text-center text-xs text-amber-200" role="alert">{error}</p>}

					<button type="submit" disabled={isLoading} className="w-full rounded-full bg-[#C49A4A] py-2.5 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
						{isLoading ? "Memproses..." : "Login"}
					</button>
				</form>
			</section>
		</main>
	);
}
