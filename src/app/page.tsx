"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useState } from "react";

export default async function Home() {
	const [email, setEmail] = use

	useEffect(
		() =>
			void (async () => {
				const response = await signIn("azure-ad");
				console.log("Sign in response", response);

				const email = response.user.email;

			})(),
		[],
	);

	return null;
}
