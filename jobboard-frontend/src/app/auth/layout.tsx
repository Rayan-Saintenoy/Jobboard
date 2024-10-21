import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Go find work - auth",
  description: "You will find your job",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
