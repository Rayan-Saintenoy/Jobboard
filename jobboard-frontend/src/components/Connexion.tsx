"use client";

import Clef from "@/assets/images/Clef.svg";
import Lettre from "@/assets/images/Lettre.svg";
import { signIn } from "next-auth/react";

import Image from "next/image";

import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

export default function Connexion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    signIn("credentials", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-4 mx-auto w-full px-7 md:w-2/3 lg:h-3/4"
    >
      <div className="border border-gray-400 rounded-xl p-5">
        <p className="text-3xl mb-5 text-center">Connexion :</p>
        <div className="mb-5 px-2">
          <label className="input input-bordered flex items-center gap-2">
            <Image src={Lettre} alt="Lettre" />
            <input
              type="text"
              className="grow dark:text-black"
              {...register("email", { required: true })}
              placeholder="Email :"
            />
          </label>
          {errors.email && <span>Ce champ est requis</span>}
        </div>
        <div className="mb-5 px-2">
          <label className="input input-bordered flex items-center gap-2 mb-5">
            <Image src={Clef} alt="Clef" />
            <input
              type="password"
              className="grow dark:text-black"
              {...register("password", { required: true })}
              placeholder="Mot de passe :"
            />
          </label>
          {errors.password && <span>Ce champ est requis</span>}
        </div>

        <div className="flex items-end">
          <button className="btn ml-auto" type="submit">
            Se connecter
          </button>
        </div>
      </div>
    </form>
  );
}
