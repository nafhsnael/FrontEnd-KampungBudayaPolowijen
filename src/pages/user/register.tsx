import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

export default function UserRegisterPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!email.trim() || !password) {
			setError("Email dan password wajib diisi.");
			return;
		}

		setError("");
		await router.push("/user/login");
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#4A2920] px-5 py-10 text-white">
			<form onSubmit={handleSubmit} className="w-full max-w-105 space-y-4 rounded-3xl bg-[#5C362B] p-8" noValidate>
				<h1 className="text-3xl font-bold text-[#C49A4A]">Daftar Akun</h1>
				<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="w-full rounded-full bg-[#FDF8F2] px-4 py-3 text-[#4A2920] outline-none" />
				<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="w-full rounded-full bg-[#FDF8F2] px-4 py-3 text-[#4A2920] outline-none" />
				{error && <p className="text-sm text-amber-200">{error}</p>}
				<button type="submit" className="w-full rounded-full bg-[#C49A4A] py-3 font-bold">Daftar</button>
			</form>
		</main>
	);
}
