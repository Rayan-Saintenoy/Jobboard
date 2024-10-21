"use server";

import { auth } from "@/auth";

type UserData = {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
};

export async function getUserData() {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  const data = await fetch(`${process.env.BACKEND_URL}/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.json();
}

export async function updateUser(formData: UserData) {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  try {
    const data = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
    };

    const res = await fetch(`${process.env.BACKEND_URL}/api/users/me/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const jsonResponse = await res.json();

    if (!res.ok) {
      return { status: "error", message: jsonResponse.message };
    } else {
      return { status: "success", message: jsonResponse.message };
    }
  } catch (error) {
    console.error(error);
  }
}
