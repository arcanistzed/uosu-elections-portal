import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata = {
	title: "Élections SÉUO - UOSU Elections",
	description: "Élections SÉUO - UOSU Elections",
	icons: [{ href: "/favicon.ico", sizes: "64x64", type: "image/x-icon" }],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full">
			<body className={`font-sans ${inter.variable} h-full grid bg-gray-800`}>
				<TRPCReactProvider>{children}</TRPCReactProvider>
			</body>
		</html>
	);
}
