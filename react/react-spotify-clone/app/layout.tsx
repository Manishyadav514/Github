import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Spotify - Web Player Songs for everyone",
	description: "Spotify is a digital music service that gives you access to millions of songs.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${figtree.className} pr-2`}>
				<Sidebar>
					{children}
				</Sidebar>
			</body>
		</html>
	);
}
