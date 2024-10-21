"use server";

import { auth } from "@/auth";

type AdvertisementData = {
  title: string;
  description: string;
  salary: number;
  place: string;
  working_time: number;
  skills: string;
};

export async function postAdvertisement(formData: AdvertisementData) {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  const skillsArray = formData.skills.split(",").map((skill) => skill.trim());

  try {
    const data = {
      title: formData.title,
      description: formData.description,
      salary: formData.salary,
      place: formData.place,
      working_time: formData.working_time,
      skills: skillsArray,
    };

    const res = await fetch(`${process.env.BACKEND_URL}/api/advertisements`, {
      method: "POST",
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
    console.log(error);
  }
}
