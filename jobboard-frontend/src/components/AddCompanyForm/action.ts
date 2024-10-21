"use server";

import { auth } from "@/auth";

type CompanyData = {
  name: string;
  logo_url: string;
  address: string;
  nb_of_employees: number;
};

export async function getCompanyByUserId() {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/companies/user/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(
        errorData.message ||
          "Une erreur est survenue lors de la récupération des données."
      );
    }

    return await response.json();
  } catch (error) {
    console.log("Erreur lors de la récupération des données : " + error);
  }
}

export async function putCompany(company: CompanyData) {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  const data = await fetch(`${process.env.BACKEND_URL}/api/companies/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(company),
  });

  if (!data.ok) {
    const errorData = await data.json();
    throw new Error(errorData.message || "Une erreur est survenue.");
  }
  return data.json();
}

export async function postCompany(company: CompanyData) {
  const session = await auth();
  const accessToken = session?.user.accessToken;

  const data = await fetch(`${process.env.BACKEND_URL}/api/companies/add/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(company),
  });

  if (!data.ok) {
    const errorData = await data.json();
    throw new Error(errorData.message || "Une erreur est survenue.");
  }
  return data.json();
}
