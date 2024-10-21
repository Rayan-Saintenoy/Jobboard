import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Go find work - profile",
  description: "Profile utilisateur",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
