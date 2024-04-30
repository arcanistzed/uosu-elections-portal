"use client";

import { SessionProvider, signIn, useSession } from "next-auth/react";
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

	const accessKey = api.accessKey.getByEmail.useQuery({
		email: session.data?.user.email ?? "",
	});

	useEffect(() => {
		if (!session.data) {
			void signIn("azure-ad");
		}
	}, [session.data]);

	useEffect(() => {
		if (accessKey.data) {
			redirect(`https://secure.electionbuddy.com/${accessKey.data.key}`);
		}
	}, [accessKey.data]);

	return (
		<div>
			{accessKey.error ? (
				<div>{accessKey.error.message}</div>
			) : (
				<div>Chargement... Loading...</div>
			)}
		</div>
	);
}
