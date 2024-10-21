"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { postAdvertisement } from "./action";

type Advertisement = {
  title: string;
  description: string;
  salary: number;
  place: string;
  working_time: number;
  skills: string;
};

export default function AddAdvertisementForm() {
  const [isSubmit, setIsSubmit] = useState(false);

  const { register, handleSubmit, reset } = useForm<Advertisement>();

  const onSubmit: SubmitHandler<Advertisement> = async (data) => {
    setIsSubmit(true);

    const response = await postAdvertisement(data);

    if (response?.status !== "success") {
      toast.error(response?.message || "Une erreur est survenue.");
      setIsSubmit(false);
    } else {
      setIsSubmit(false);
      toast.success("Annonce ajouté avec succès", {
        icon: "👍",
        duration: 4000,
      });
    }
    reset();
  };

  return (
    <>
      <div className="max-w-xl mx-5 w-full md:mx-auto p-6 border-2 border-blue-600 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Ajouter une offre
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="form-control">
              <input
                className="input input-bordered w-full"
                type="text"
                {...register("title")}
                placeholder="Titre"
              />
            </div>
            <div className="form-control">
              <textarea
                className="input input-bordered w-full min-h-40"
                {...register("description")}
                placeholder="Description"
              />
            </div>
            <div className="form-control">
              <input
                className="input input-bordered w-full"
                type="number"
                {...register("salary")}
                placeholder="Salaire"
              />
            </div>
            <div className="form-control">
              <input
                className="input input-bordered w-full"
                type="text"
                {...register("place")}
                placeholder="Ville"
              />
            </div>
            <div className="form-control">
              <input
                className="input input-bordered w-full"
                type="number"
                {...register("working_time")}
                placeholder="Temps de travail"
              />
            </div>
            <div className="form-control">
              <input
                className="input input-bordered w-full"
                type="text"
                {...register("skills")}
                placeholder="Compétences"
              />
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
                Ajouter
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
