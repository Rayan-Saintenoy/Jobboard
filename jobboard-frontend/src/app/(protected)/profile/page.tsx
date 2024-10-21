import { getUserData } from "@/components/UserForm/action";
import UserForm from "@/components/UserForm/UserForm";
import { getUserJobApplication } from "@/components/UserJobApplication/action";
import { UserJobApplication } from "@/components/UserJobApplication/UserJobApplication";

export default async function ProfilePage() {
  const userInformation = await getUserData();
  const userJobApplications = await getUserJobApplication();

  // console.log(userJobApplications);

  return (
    <>
      <div>
        <UserForm userData={userInformation} />
        <UserJobApplication jobApplications={userJobApplications} />
      </div>
    </>
  );
}
