"use server";

interface AdvertisementData {
  title: string;
  description: string;
  salary: number;
  place: string;
  working_time: number;
  skills: string;
}

import { auth } from "@/auth";

export async function getCompanyAdvertisement() {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  const data = await fetch(
    `${process.env.BACKEND_URL}/api/advertisements/company`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data.json();
}

export async function updateAdvertisement(
  idAdvertisement: string,
  formData: AdvertisementData
) {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  try {
    const skillsArray = formData.skills
      ? formData.skills.split(",").map((skill) => skill.trim())
      : [];

    const data = {
      title: formData.title,
      description: formData.description,
      salary: String(formData.salary),
      place: formData.place,
      working_time: String(formData.working_time),
      skills: skillsArray,
    };

    console.log(JSON.stringify(data));

    const res = await fetch(
      `${process.env.BACKEND_URL}/api/advertisements/${idAdvertisement}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

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

export async function deleteAdvertisement(idAdvertisement: string) {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/advertisements/${idAdvertisement}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

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
