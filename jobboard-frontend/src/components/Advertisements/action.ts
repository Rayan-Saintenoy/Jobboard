"use server";

import { auth } from "@/auth";

export async function getAdvertisementsCount() {
  try {
    const data = await fetch(
      `${process.env.BACKEND_URL}/api/advertisements/count`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!data.ok) {
      throw new Error("Network response was not ok");
    }

    const count = await data.json();
    // console.log(count);
    return count;
  } catch (error) {
    console.error("Error fetching advertisements count:" + error);
  }
}

export async function calculCountOfPages() {
  const count = await getAdvertisementsCount();
  const totalPages = Math.ceil(Number(count) / 5);

  // console.log(totalPages);
  return totalPages;
}

export async function getAdvertisements(page: string) {
  const limit = 5;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/advertisements/?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const advertisements = await response.json();
    // console.log("Advertisements data:", advertisements);
    return advertisements;
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    return;
  }
}

export async function getAdvertisementById(advertisementId: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/advertisements/${advertisementId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error fetching advertisements: ${error}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    return;
  }
}

export async function submitJobApplication(advertisementsId: string) {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  try {
    const jsonBody = JSON.stringify({ advertisementsId: advertisementsId });

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/job_application`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: jsonBody,
      }
    );

    const jsonResponse = await response.json();

    if (!response.ok) {
      return { status: "error", message: jsonResponse.message };
    } else {
      return { status: "success", message: jsonResponse.message };
    }
  } catch (error) {
    console.error("Error when submiting:", error);
    return;
  }
}
