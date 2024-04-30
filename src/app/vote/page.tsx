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
		<main className="flex items-center justify-center p-2 text-white">
			<h1 className="text-3xl font-bold">Chargement... Loading...</h1>
		</main>
	);
}
