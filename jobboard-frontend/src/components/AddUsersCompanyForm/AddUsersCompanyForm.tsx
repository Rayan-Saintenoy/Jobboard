"use client";

import Lettre from "@/assets/images/Lettre.svg";
import Image from "next/image";
import { useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { patchUsersToCompany } from "./action";

type Inputs = {
  email: string;
};

export default function AdminUsersCompanyForm() {
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmit(true);

    try {
      const response = await patchUsersToCompany(data);
      if (!response) {
        console.log(response.message);
        toast.error(response.message || "Une erreur est survenue.");
      } else {
        reset();
        toast.success(
          "Vous avez ajouter l'utilisateur à vôtre entreprise avec succès !",
          {
            icon: "👍",
            duration: 4000,
          }
        );
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la mise à jour." + error);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center">
          <div className="max-w-screen border border-gray-400 rounded-xl p-5">
            <p className="text-2xl mb-5 text-center">
              Assigne l&apos;utilisateur à votre entreprise :
            </p>
            <label className="input input-bordered flex items-center gap-2 mb-3">
              <Image src={Lettre} alt="Lettre" />
              <input
                type="text"
                className="grow dark:text-black"
                {...register("email", { required: true })}
                placeholder="Email :"
              />
            </label>
            {errors.email && <span>Ce champ est requis</span>}

            <div className="flex flex-col items-end">
              {!isSubmit ? (
                <button className="btn ml-auto" type="submit">
                  Envoyer
                </button>
              ) : (
                <button className="btn btn-disabled" type="submit">
                  <span className="loading loading-dots loading-md"></span>
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
      <Toaster position="bottom-right" />
    </>
  );
}
