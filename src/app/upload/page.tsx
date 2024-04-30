"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";

type AccessKey = {
	key: string;
	email: string;
};

export default function Upload() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [status, setStatus] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const mutation = api.accessKey.uploadList.useMutation();

	api.accessKey.verifyPassword.useQuery({
		password: password ?? "",
	}, {
		enabled: !!password,
	});

	// Handle password change
	const onPasswordChange = async (event: React.FormEvent) => {
		const password = (event.target as HTMLInputElement).value;
		setPassword(password);
	};

	// Handle file selection
	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setStatus("Uploading...");
			setFile(file);
		}
	};

	useEffect(() => {
		// Reset file input
		const reset = () => {
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
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
				setStatus("Error: Missing required columns (key and email)");
				reset();
				return;
			}

			// Parse rows
			const list = rows
				.map(row => {
					const values = row.split(",").map(v => v.trim());
					const [key, email] = indexes.map(i => values[i]);
					if (!key || !email) {
						return null;
					}
					return { key, email };
				})
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
						: `Error: ${error}`,
				);
				reset();
				return;
			}
			setStatus(`Uploaded ${list.length} access keys`);
			reset();
		};

		if (file) {
			onUpload(file);
		}
	}, [file]);

	return (
		<main className="bg-gray-600 text-white p-4 rounded-lg shadow-lg m-auto flex flex-col gap-4">
			<h1 className="text-2xl font-bold text-center">Upload Access Keys</h1>
			<div className="flex justify-between items-center gap-4">
				<label htmlFor="password">Password</label>
				<input
					type="password"
					id="password"
					onChange={onPasswordChange}
					className="bg-gray-500 p-2 rounded"
				/>
			</div>
			<input
				type="file"
				accept=".csv"
				id="file"
				onChange={onFileChange}
				ref={fileInputRef}
				className="bg-gray-500 p-2 rounded file:bg-gray-500 file:border-white file:border-solid file:rounded file:text-white"
			/>
			{status && <p>{status}</p>}
		</main>
	);
}
