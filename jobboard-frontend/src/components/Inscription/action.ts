"use server";

type Inscription = {
  lastname: string;
  firstname: string;
  phoneNumber?: string;
  email: string;
  password: string;
  confirm?: string;
};

export async function postInscription(NewData: Inscription) {
  const data = {
    lastname: NewData.lastname,
    firstname: NewData.firstname,
    phoneNumber: NewData.phoneNumber,
    email: NewData.email,
    password: NewData.password,
  };

  const response = await fetch(`${process.env.BACKEND_URL}/api/users/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const jsonResponse = await response.json();

  if (!response.ok) {
    return { status: "error", message: jsonResponse.message };
  } else {
    return { status: "success", data: jsonResponse };
  }
}
