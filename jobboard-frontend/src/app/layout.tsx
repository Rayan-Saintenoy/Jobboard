import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import "@/style/globals.css";
import { SessionProvider } from "next-auth/react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session) {
    console.log(session);
  }

  return (
    <SessionProvider>
      <html lang="fr">
        <body>
          <header>
            <Navbar />
          </header>
          <main>{children}</main>
        </body>
      </html>
    </SessionProvider>
  );
}
