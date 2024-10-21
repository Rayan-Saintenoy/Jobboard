import { auth } from "@/auth";
import AdminForm from "@/components/AdminForm/AdminForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Go find work - panel admin",
  description: "Admin panel",
};

export default async function AdminPanel() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  return (
    <>
      <AdminForm />
    </>
  );
}
