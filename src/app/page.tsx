"use client";

import { type Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/trpc/react";

export default function Home({
	session,
}: Readonly<{
	session: Session & {
		user: {
			email: string;
		};
		expires: number;
	};
}>) {
	return (
		<SessionProvider session={session}>
			<Main />
		</SessionProvider>
	);
}

function Main() {
	const session = useSession();
	const router = useRouter();

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
			void router.push(
				`https://secure.electionbuddy.com/${accessKey.data.key}`,
			);
		}
	}, [accessKey.data, router]);

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
