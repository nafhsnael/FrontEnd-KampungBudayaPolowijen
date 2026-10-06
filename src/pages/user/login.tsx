import { useRouter } from "next/router";
import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export default function UserLoginPage() {
	const router = useRouter();

	const handleSubmit = async (data: { email: string; password: string; rememberMe: boolean }) => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: data.email, password: data.password }),
		});

		if (!response.ok) {
			const body = await response.json().catch(() => ({}));
			throw new Error(body?.message ?? "Email atau password salah.");
		}

		const { data: payload } = await response.json();
		const storage = data.rememberMe ? localStorage : sessionStorage;
		storage.setItem("accessToken", payload.accessToken);
		localStorage.setItem("user_role", "user");
		await router.push("/user/umkm");
	};

	const handleGoogleLogin = async () => {
		throw new Error("Login Google belum tersedia.");
	};

	return (
		<main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#4A2920] px-5 py-10 max-[760px]:items-start">
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
				<LoginForm onSubmit={handleSubmit} onGoogleLogin={handleGoogleLogin} />
			</div>
		</main>
	);
}
