"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
	/* useEffect(() => {
		void signIn("azure-ad", { callbackUrl: `/vote` });
	}); */

	return (
		<main className="flex flex-col items-center justify-center gap-8 p-2 text-white">
			<h1 className="text-6xl font-bold">Chargement...</h1>
			<h1 className="text-6xl font-bold">Loading...</h1>
			<img src="/logo.svg" alt="logo" className="h-24" />
		</main>
	);
}
