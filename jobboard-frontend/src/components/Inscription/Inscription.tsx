"use client";

import Clef from "@/assets/images/Clef.svg";
import Lettre from "@/assets/images/Lettre.svg";
import Perso from "@/assets/images/Perso.svg";
import Tel from "@/assets/images/Tel.svg";

import Image from "next/image";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { postInscription } from "./action";

type Inscription = {
  lastname: string;
  firstname: string;
  phoneNumber?: string;
  email: string;
  password: string;
  confirm?: string;
};

export default function Inscription() {
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inscription>();

  const onSubmit: SubmitHandler<Inscription> = async (data) => {
    setIsSubmit(true);
    const response = await postInscription(data);

    if (response.status !== "success") {
      setIsSubmit(false);
      toast.error(response.message || "Une erreur est survenue.");
    } else {
      setIsSubmit(false);
      reset();
      toast.success("Vous êtes inscris avec succès !", {
        icon: "👍",
        duration: 4000,
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sm:max-w-screen-sm sm:max-w-screen-m lg:max-w-screen-lg xl:max-w-screen-xl my-4 mx-auto"
      >
        <div className="border border-gray-400 rounded-xl p-12">
          <p className="text-3xl mb-5 text-center">Inscription :</p>
          <div className="lg:flex gap-3 px-2">
            <div className="mb-5 ">
              <label className="input input-bordered flex items-center gap-2 mb-1 ">
                <Image src={Perso} alt="Perso" />
                <input
                  type="text"
                  placeholder="Nom :"
                  {...register("lastname", {
                    required: "Le nom est obligatoire.",
                    pattern: {
                      value: /^[A-Za-zÀ-ÖØ-öø-ÿ\-]+$/,
                      message: "Le nom n'est pas valide.",
                    },
                  })}
                />
              </label>
              {errors.lastname && (
                <span className="font-semibold text-red-500" role="alert">
                  {errors.lastname.message}
                </span>
              )}
            </div>
            <div className="mb-5 lg:w-full ">
              <label className="input input-bordered flex items-center gap-2 mb-1 ">
                <Image src={Perso} alt="Perso" />
                <input
                  type="text"
                  placeholder="Prénom :"
                  {...register("firstname", {
                    required: "Le prénom est obligatoire.",
                    pattern: {
                      value: /^[A-Za-zÀ-ÖØ-öø-ÿ\-]+$/,
                      message: "Le prénom n'est pas valide.",
                    },
                  })}
                />
              </label>
              {errors.firstname && (
                <span className="font-semibold text-red-500" role="alert">
                  {errors.firstname.message}
                </span>
              )}
            </div>
          </div>
          <div className="mb-5  px-2">
            <label className="input input-bordered flex items-center gap-2 mb-1">
              <Image src={Lettre} alt="Lettre" />
              <input
                type="text"
                {...register("email", {
                  required: "L'email est obligatoire.",
                  pattern: {
                    value:
                      /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim,
                    message: "Le email n'est pas valide.",
                  },
                })}
                placeholder="Email :"
              />
            </label>
            {errors.email && (
              <span className="font-semibold text-red-500" role="alert">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="mb-5  px-2">
            <label className="input input-bordered flex items-center gap-2 mb-1">
              <Image src={Tel} alt="Tel" width={15} height={15} />
              <input
                type="text"
                placeholder="N° de téléphone :"
                {...register("phoneNumber", {
                  pattern: {
                    value: /^(?:\+33\s[1-9]{1}\d{8}|0[1-9](?:\s?\d{2}){4})$/,
                    message: "Le numéro n'est pas valide",
                  },
                })}
              />
            </label>
            {errors.phoneNumber && (
              <span className="font-semibold text-red-500" role="alert">
                {errors.phoneNumber.message}
              </span>
            )}
          </div>

          <div className="mb-5  px-2">
            <label className="input input-bordered flex items-center gap-2 mb-1">
              <Image src={Clef} alt="Clef" />
              <input
                type="password"
                {...register("password", {
                  required: "Le mot de passe est obligatoire.",
                  minLength: {
                    value: 12,
                    message:
                      "Le mots de passe est trop court, il doit contenir au moins 12 caractères.",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
                    message:
                      "Le mot de passe doit contenir au moins une majuscule, une minuscule, un caractère spécial et un chiffre ",
                  },
                })}
                placeholder="Mot de passe :"
              />
            </label>
            {errors.password && (
              <span className="font-semibold text-red-500" role="alert">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="mb-5  px-2">
            <label className="input input-bordered flex items-center gap-2 mb-1">
              <Image src={Clef} alt="Clef" />
              <input
                type="password"
                {...register("confirm", {
                  required: "La confirmation du mot de passe est obligatoire.",
                  validate: (value) => {
                    return (
                      value === watch("password") ||
                      "Les mots de passe ne correspondent pas."
                    );
                  },
                })}
                placeholder="Confirmation :"
              />
            </label>
            {errors.confirm && (
              <span className="font-semibold text-red-500" role="alert">
                {errors.confirm.message}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end">
            {!isSubmit ? (
              <button className="btn ml-auto" type="submit">
                S&apos;inscrire
              </button>
            ) : (
              <button className="btn btn-disabled" type="submit">
                <span className="loading loading-dots loading-md"></span>
              </button>
            )}
          </div>
        </div>
      </form>
      <Toaster position="bottom-right" />
    </>
  );
}
