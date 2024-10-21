"use server";

import { auth } from "@/auth";

export async function getUserJobApplication() {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  try {
    const data = await fetch(
      `${process.env.BACKEND_URL}/api/job_application/user`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data.json();
  } catch (error) {
    console.log(error);
  }
}
