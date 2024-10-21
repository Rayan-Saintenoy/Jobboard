import { auth } from "@/auth";
import AddAdvertisementForm from "@/components/AddAdvertisementForm/AddAdvertisementForm";
import { getCompanyByUserId } from "@/components/AddCompanyForm/action";
import AddCompanyForm from "@/components/AddCompanyForm/AddCompanyForm";
import AddUsersCompanyForm from "@/components/AddUsersCompanyForm/AddUsersCompanyForm";
import { getCompanyAdvertisement } from "@/components/CompanyAdvertisements/action";
import CompanyAdvertisements from "@/components/CompanyAdvertisements/CompanyAdvertisements";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Go find work - panel recruiter",
  description: "Recruiter panel",
};

export default async function RecruiterPanel() {
  const session = await auth();

  if (!session?.user?.isRecruiter) {
    redirect("/");
  }

  const companyAdvertisements = await getCompanyAdvertisement();

  const company = await getCompanyByUserId();
  const isCompany = !!company;

  return (
    <>
      <AddCompanyForm />
      {isCompany && (
        <>
          <div className="flex flex-col gap-5 w-full items-center py-5">
            <AddAdvertisementForm />
            <CompanyAdvertisements advertisements={companyAdvertisements} />
            <AddUsersCompanyForm />
          </div>
        </>
      )}
    </>
  );
}
