"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { api } from "~/trpc/react";

export default function Home() {
	return (
		<SessionProvider>
			<Main />
		</SessionProvider>
	);
}

function Main() {
	const session = useSession();

	const accessKey = api.accessKey.getByEmail.useQuery(
		{
			email: session.data?.user.email ?? "",
		},
		{ enabled: !!session.data?.user.email },
	);

	useEffect(() => {
		if (accessKey.data) {
			redirect(`https://secure.electionbuddy.com/${accessKey.data.key}`);
		}
	}, [accessKey.data]);

	return (
		<main className="flex flex-col items-center justify-center gap-8 p-2 text-white">
			<h1 className="text-6xl font-bold">Chargement...</h1>
			<h1 className="text-6xl font-bold">Loading...</h1>
			<img src="/logo.svg" alt="logo" className="h-24" />
		</main>
	);
}
