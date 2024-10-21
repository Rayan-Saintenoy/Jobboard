"use server";

import { auth } from "@/auth";

type Inputs = {
  email: string;
};

export async function patchUsersToCompany(inputs: Inputs) {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  console.log(accessToken);

  const email = inputs.email;

  const data = await fetch(
    `${process.env.BACKEND_URL}/api/users/add/company/user`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ userEmail: email }),
    }
  );

  if (!data.ok) {
    const errorData = await data.json();
    throw new Error(errorData.message || "Une erreur est survenue.");
  }
  return data.json();
}
