"use server";

import { auth } from "@/auth";

type Inputs = {
  email: string;
};

export async function patchUsers(inputs: Inputs) {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  const email = inputs.email;

  const data = await fetch(
    `${process.env.BACKEND_URL}/api/users/${email}/recruiter`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (data.ok) {
    return data.json();
  }
  return;
}
