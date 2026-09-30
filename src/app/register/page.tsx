"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import {
	Eye,
	EyeOff,
	Loader2,
	LockKeyhole,
	Mail,
	UserRound,
} from "lucide-react";

const GoogleIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="h-5.5 w-5.5 shrink-0"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			fill="#4285F4"
			d="M21.6 12.23c0-.68-.06-1.34-.17-1.97H12v3.72h5.39a4.6 4.6 0 0 1-1.99 3.02v2.5h3.22c1.88-1.73 2.98-4.28 2.98-7.27Z"
		/>
		<path
			fill="#34A853"
			d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.22-2.5c-.9.6-2.05.95-3.4.95-2.61 0-4.82-1.76-5.6-4.13H.72v2.6A10 10 0 0 0 12 22Z"
		/>
		<path
			fill="#FBBC05"
			d="M6.4 19.87A6.02 6.02 0 0 1 5.8 17.2V14.6H2.7A10 10 0 0 1 2 12c0-1.62.39-3.15 1.08-4.5l3.05 2.37A6.06 6.06 0 0 0 5.8 12.1c0 .66.12 1.3.34 1.91l.26 2.93Z"
		/>
		<path
			fill="#EA4335"
			d="M12 4.98c1.17 0 2.23.4 3.07 1.18l2.3-2.3A9.97 9.97 0 0 0 12 2a10 10 0 0 0-9.28 5.5l3.1 2.38A5.98 5.98 0 0 1 12 4.98Z"
		/>
	</svg>
);

export default function RegisterPage() {
	const router = useRouter();
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setForm((previous) => ({ ...previous, [name]: value }));
		if (error) setError(null);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		if (
			!form.name.trim() ||
			!form.email.trim() ||
			!form.password ||
			!form.confirmPassword
		) {
			setError("Semua kolom wajib diisi.");
			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
			setError("Format email tidak valid.");
			return;
		}

		if (form.password.length < 6) {
			setError("Password minimal 6 karakter.");
			return;
		}

		if (form.password !== form.confirmPassword) {
			setError("Konfirmasi password harus sama dengan password.");
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/auth/register`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						fullName: form.name.trim(),
						email: form.email.trim(),
						password: form.password,
					}),
				}
			);

			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				throw new Error(
					body?.message ?? "Pendaftaran belum dapat diproses. Silakan coba lagi."
				);
			}

			router.push("/login");
		} catch (submitError: unknown) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "Pendaftaran gagal. Silakan coba lagi."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="relative flex min-h-screen w-full items-center justify-center bg-[#4A2920] px-5 py-10 max-[760px]:items-start">
			<div className="absolute inset-0" aria-hidden="true">
				<Image
					src="/images/login.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-top"
				/>
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(155,58,50,0.7)_0%,rgba(74,42,30,0.95)_100%)]" />
			</div>

			<div className="relative z-10 w-full max-w-131.25">
				<div className="text-white">
					<div className="flex h-14 items-center gap-3">
						<div className="relative h-14 w-12 shrink-0 overflow-hidden">
							<Image
								src="/images/logo2.png"
								alt="Logo Kampung Budaya Polowijen"
								fill
								sizes="48px"
								className="object-contain"
							/>
						</div>
						<div className="leading-none">
							<div className="text-[11px] font-medium text-stone-200">
								Kampung Budaya
							</div>
							<div className="mt-1 text-2xl font-semibold text-white">
								Polowijen
							</div>
						</div>
					</div>

					<header className="mt-6">
						<h1 className="text-4xl font-bold leading-tight text-[#E0BF6B]">
							Daftar Akun
						</h1>
						<p className="mt-1 max-w-116.25 text-[15px] leading-snug text-white">
							Buat akun untuk jelajahi kekayaan budaya &quot;Kampung Budaya
							Polowijen&quot;.
						</p>
					</header>

					<form onSubmit={handleSubmit} noValidate className="mt-4">
						<div className="space-y-4">
							<div className="relative">
								<UserRound
									size={19}
									aria-hidden="true"
									className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#4A2920]"
								/>
								<input
									id="register-name"
									name="name"
									type="text"
									autoComplete="name"
									value={form.name}
									onChange={handleChange}
									placeholder="Nama Lengkap"
									aria-label="Nama Lengkap"
									className="h-14 w-full rounded-full border border-transparent bg-[#eaf0fd] pl-14 pr-5 text-[15px] text-stone-800 placeholder:text-stone-500 focus:border-[#E0BF6B] focus:outline-none focus:ring-2 focus:ring-[#E0BF6B]/30"
								/>
							</div>

							<div className="relative">
								<Mail
									size={19}
									aria-hidden="true"
									className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#4A2920]"
								/>
								<input
									id="register-email"
									name="email"
									type="email"
									autoComplete="email"
									value={form.email}
									onChange={handleChange}
									placeholder="Email"
									aria-label="Email"
									className="h-14 w-full rounded-full border border-transparent bg-[#eaf0fd] pl-14 pr-5 text-[15px] text-stone-800 placeholder:text-stone-500 focus:border-[#E0BF6B] focus:outline-none focus:ring-2 focus:ring-[#E0BF6B]/30"
								/>
							</div>

							<div className="relative">
								<LockKeyhole
									size={19}
									aria-hidden="true"
									className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#4A2920]"
								/>
								<input
									id="register-password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									value={form.password}
									onChange={handleChange}
									placeholder="Password"
									aria-label="Password"
									className="h-14 w-full rounded-full border border-transparent bg-[#eaf0fd] pl-14 pr-14 text-[15px] text-stone-800 placeholder:text-stone-500 focus:border-[#E0BF6B] focus:outline-none focus:ring-2 focus:ring-[#E0BF6B]/30"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((visible) => !visible)}
									aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
									className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-stone-600 transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#9B3A32]"
								>
									{showPassword ? (
										<EyeOff size={18} aria-hidden="true" />
									) : (
										<Eye size={18} aria-hidden="true" />
									)}
								</button>
							</div>

							<div className="relative">
								<LockKeyhole
									size={19}
									aria-hidden="true"
									className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#4A2920]"
								/>
								<input
									id="register-confirm-password"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									autoComplete="new-password"
									value={form.confirmPassword}
									onChange={handleChange}
									placeholder="Konfirmasi Password"
									aria-label="Konfirmasi Password"
									className="h-14 w-full rounded-full border border-transparent bg-[#eaf0fd] pl-14 pr-14 text-[15px] text-stone-800 placeholder:text-stone-500 focus:border-[#E0BF6B] focus:outline-none focus:ring-2 focus:ring-[#E0BF6B]/30"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword((visible) => !visible)}
									aria-label={
										showConfirmPassword
											? "Sembunyikan konfirmasi password"
											: "Tampilkan konfirmasi password"
									}
									className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-stone-600 transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#9B3A32]"
								>
									{showConfirmPassword ? (
										<EyeOff size={18} aria-hidden="true" />
									) : (
										<Eye size={18} aria-hidden="true" />
									)}
								</button>
							</div>
						</div>

						{error && (
							<p
								role="alert"
								className="mt-3 rounded-xl border border-red-300/40 bg-red-950/45 px-4 py-3 text-sm leading-5 text-rose-100"
							>
								{error}
							</p>
						)}

						<button
							type="submit"
							disabled={isLoading}
							  className="mt-2 flex h-15 w-full items-center justify-center gap-2 rounded-full bg-[#C49A45] px-5 text-lg font-bold text-white transition-colors hover:bg-[#ad8438] disabled:cursor-not-allowed disabled:opacity-70"
						>
							{isLoading ? (
								<>
									<Loader2 size={19} className="animate-spin" aria-hidden="true" />
									<span>Mendaftarkan...</span>
								</>
							) : (
								"Daftar"
							)}
						</button>
					</form>

					<div className="my-6 flex items-center gap-3">
						<div className="h-px flex-1 bg-white/30" />
						<span className="text-sm text-stone-200">atau masuk dengan</span>
						<div className="h-px flex-1 bg-white/30" />
					</div>

					<button
						type="button"
						onClick={() => setError("Pendaftaran dengan Google belum tersedia.")}
						className="flex h-15 w-full items-center justify-center gap-3 rounded-full bg-[#9B3A32] px-5 text-lg font-bold text-white transition hover:bg-[#873129] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0BF6B]"
					>
						<GoogleIcon />
						<span>Google</span>
					</button>

					<p className="mt-6 text-center text-sm leading-5 text-stone-200">
						Sudah punya akun?{" "}
						<Link
							href="/login"
							className="font-semibold text-[#E0BF6B] underline underline-offset-2 hover:text-[#f0d78e]"
						>
							Masuk sekarang
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}
