"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateUser } from "./action";

type UserData = {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
};

type UserFormProps = {
  userData: UserData;
};

export default function UserForm({ userData }: UserFormProps) {
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({ defaultValues: userData });

  const onSubmit: SubmitHandler<UserData> = async (data) => {
    setIsSubmit(true);
    const response = await updateUser(data);

    if (response?.status !== "success") {
      toast.error(response?.message || "Une erreur est survenue.");
      setIsSubmit(false);
    } else {
      setIsSubmit(false);
      toast.success("Informations modifié avec succes", {
        icon: "👍",
        duration: 4000,
      });
    }
  };

  return (
    <>
      <div className="max-w-xl mx-5 my-3 md:mx-auto p-6 border-2 border-blue-600 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Vos informations
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="form-control">
              <input
                className="input input-bordered w-full"
                type="text"
                {...register("firstname", {
                  required: "Le prénom est obligatoire.",
                  pattern: {
                    value: /^[A-Za-zÀ-ÖØ-öø-ÿ\-]+$/,
                    message: "Le prénom n'est pas valide.",
                  },
                })}
                placeholder="Prénom"
              />
              {errors.firstname && (
                <span className="font-semibold text-red-500" role="alert">
                  {errors.firstname.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <input
                className="input input-bordered w-full"
                type="text"
                {...register("lastname", {
                  required: "Le nom est obligatoire.",
                  pattern: {
                    value: /^[A-Za-zÀ-ÖØ-öø-ÿ\-]+$/,
                    message: "Le nom n'est pas valide.",
                  },
                })}
                placeholder="Nom"
              />
              {errors.lastname && (
                <span className="font-semibold text-red-500" role="alert">
                  {errors.lastname.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <input
                className="input input-bordered w-full"
                type="email"
                {...register("email", {
                  required: "L'email est obligatoire.",
                  pattern: {
                    value:
                      /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim,
                    message: "Le email n'est pas valide.",
                  },
                })}
                placeholder="Email"
              />
              {errors.email && (
                <span className="font-semibold text-red-500" role="alert">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <input
                className="input input-bordered w-full"
                type="text"
                {...register("phoneNumber", {
                  pattern: {
                    value: /^(?:\+33\s[1-9]{1}\d{8}|0[1-9](?:\s?\d{2}){4})$/,
                    message: "Le numéro n'est pas valide",
                  },
                })}
                placeholder="Numéro de téléphone"
              />
              {errors.phoneNumber && (
                <span className="font-semibold text-red-500" role="alert">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
          </div>
          <div className="form-control pt-6">
            {isSubmit ? (
              <button className="w-full btn btn-primary btn-outline btn-disabled">
                <span className="loading loading-dots loading-md"></span>
              </button>
            ) : (
              <button
                className="w-full btn btn-primary btn-outline"
                type="submit"
              >
                Enregistrer
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
