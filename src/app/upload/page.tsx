"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";

type AccessKey = {
	key: string;
	email: string;
};


const Form = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const fileRef = useRef<File | null>(null);
	const [status, setStatus] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const mutation = api.accessKey.uploadList.useMutation();

	api.accessKey.verifyPassword.useQuery(
		{
			password: password ?? "",
		},
		{
			enabled: !!password,
		},
	);

	// Handle password change
	const onPasswordChange = async (event: React.FormEvent) => {
		const password = (event.target as HTMLInputElement).value;
		setPassword(password);
	};

	// Handle file selection
	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setStatus("Téléchargement... Uploading...");
			fileRef.current = file;
		}
	};

	useEffect(() => {
		// Reset file input
		const reset = () => {
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		};

		// Parse access key from row
		const parseAccessKey = (
			row: string,
			indexes: number[],
		): AccessKey | null => {
			const values = row.split(",").map(v => v.trim());
			const [key, email] = indexes.map(i => values[i]);
			if (!key || !email) {
				return null;
			}
			return { key, email };
		};

		// Handle file upload
		const onUpload = async (file: File) => {
			const text = await file.text();

			// Get header and rows
			const [header, ...rows] = text.split("\n");

			// Get position of key and email columns
			const headers = header?.split(",").map(h => h.trim().toLowerCase());
			const indexes = ["key", "email"].map(
				h => headers?.indexOf(h) ?? -1,
			);

			// Check if key and email columns are present
			if (indexes.some(i => i === -1)) {
				setStatus(
					"Erreur: Colonnes obligatoires manquantes. Error: Missing required columns. (key, email)",
				);
				reset();
				return;
			}

			const list = rows
				.map(row => parseAccessKey(row, indexes))
				.filter(Boolean) as AccessKey[];

			// Try to upload list
			try {
				await mutation.mutateAsync({
					password,
					list,
				});
			} catch (error) {
				setStatus(
					error instanceof Error
						? `Error: ${error.message}`
						: "Une erreur inconnue s'est produite. An unknown error occurred.",
				);
				reset();
				return;
			}
			setStatus(
				`${list.length} clés d'accès téléchargées! Uploaded ${list.length} access keys!`,
			);
			reset();
		};

		// Upload file if changed
		if (fileRef.current) {
			void onUpload(fileRef.current);
			fileRef.current = null;
		}
	}, [mutation, password]);

	return (
		<div className="m-4 flex w-full flex-col gap-4 rounded-lg bg-gray-600 p-4 text-white shadow-lg lg:w-1/3 sm:w-3/4">
			<h1 className="text-center text-2xl font-bold">
				Télécharger des clés d&apos;accès
				<br />
				Upload Access Keys
			</h1>
			<div className="flex w-full items-center justify-between gap-4 whitespace-nowrap">
				<label htmlFor="password">
					Mot de passe
					<br />
					Password
				</label>
				<input
					type="password"
					id="password"
					onChange={onPasswordChange}
					className="w-full rounded bg-gray-500 p-2"
				/>
			</div>
			<label
				htmlFor="file"
				className="cursor-pointer rounded bg-blue-500 p-2 text-center font-bold"
			>
				Télécharger le fichier CSV
				<br />
				Upload CSV file
			</label>
			<input
				type="file"
				accept=".csv"
				id="file"
				onChange={onFileChange}
				ref={fileInputRef}
				className="hidden"
			/>
			{status && <p className="text-center">{status}</p>}
		</div>
	);
};

const Instructions = () => (
	<div className="m-4 flex w-full flex-col gap-4 rounded-lg bg-gray-600 p-4 text-white shadow-lg sm:w-3/4 lg:w-1/3">
		<details>
			<summary className="text-2xl font-bold">
				Trouver le fichier CSV
				<br />
				Finding the CSV file
			</summary>
			<div className="flex flex-col gap-4">
				<p>
					Dans le menu &quot;Actions&quot; de la page de résultats
					d&apos;ElectionsBuddy, utilisez le bouton &quot;Télécharger
					les clés&quot; dans ElectionBuddy pour obtenir le fichier
					CSV, en sélectionnant le filtre &quot;Tous les
					électeurs&quot;, le format de téléchargement &quot;Fichier
					CSV avec les valeurs des clés d&apos;accès uniquement&quot;
					et l&apos;option &quot;Toutes les informations de la liste
					électorale et les clés d&apos;accès&quot; pour les
					informations de la liste électorale.
				</p>
				<p>
					In the &quot;Actions&quot; menu of the ElectionsBuddy
					Results page, use the &quot;Download Keys&quot; button to
					get the CSV file, selecting the &quot;All voters&quot;
					filter, the &quot;CSV file with access key values only&quot;
					download format, and the &quot;All voter list information
					and access keys&quot; option for voter list information.
				</p>
			</div>
		</details>
		<details>
			<summary className="text-2xl font-bold">
				Trouver le mot de passe
				<br />
				Finding the password
			</summary>
			<div className="flex flex-col gap-4">
				<p>
					Le mot de passe se trouve dans le fichier .env où est
					hébergée cette application. Contactez l&apos;administrateur
					pour le mot de passe.
				</p>
				<p>
					The password is in the .env file where this application is
					hosted. Contact the administrator for the password.
				</p>
			</div>
		</details>
	</div>
);

export default function Upload() {
	return (
		<main className="flex flex-col items-center justify-evenly gap-4 lg:flex-row p-4">
			<Form />
			<Instructions />
			<img src="/logo.svg" alt="logo" />
		</main>
	);
}
