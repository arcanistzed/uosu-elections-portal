"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
	useEffect(() => {
		void signIn("azure-ad", { callbackUrl: `/vote` });
	});

	return (
		<main className="flex items-center justify-center p-2 text-white">
			<h1 className="text-3xl font-bold">
				Chargement...
				<br />
				Loading...
			</h1>
			<img src="/logo.svg" alt="logo" />
		</main>
	);
}
