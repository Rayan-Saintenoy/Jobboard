"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { getCompanyByUserId, postCompany, putCompany } from "./action";

type CompanyData = {
  name: string;
  logo_url: string;
  address: string;
  nb_of_employees: number;
};

type CompanyFormProps = {
  companyData?: CompanyData;
};

export default function AddCompanyDataForm({ companyData }: CompanyFormProps) {
  const [isSubmit, setIsSubmit] = useState(false);
  const [isCompany, setIsCompany] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyData>({
    defaultValues: companyData || {
      name: "",
      logo_url: "",
      address: "",
      nb_of_employees: 0,
    },
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const company = await getCompanyByUserId();
        if (company) {
          reset(company);
          setIsCompany(true);
        } else {
          setIsCompany(false);
        }
      } catch (error) {
        toast.error("Erreur lors de la récupération des données : " + error);
      }
    };

    fetchCompanyData();
  }, [reset]);

  const onSubmit: SubmitHandler<CompanyData> = async (data) => {
    setIsSubmit(true);

    try {
      if (!isCompany) {
        await postCompany(data);
        toast.success("Vous avez créé votre entreprise avec succès !", {
          icon: "👍",
          duration: 4000,
        });
      } else {
        await putCompany(data);
        toast.success("Informations modifié avec succes", {
          icon: "👍",
          duration: 4000,
        });
      }

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Une erreur est survenue : " + error);
    }

    reset();
    setIsSubmit(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center">
          <div className="max-w-screen border border-gray-400 rounded-xl p-5">
            <p className="text-2xl mb-5 text-center">
              {isCompany ? "Modifier" : "Créer"} votre entreprise
            </p>
            <label className="input input-bordered flex items-center gap-2 mb-3">
              <input
                type="text"
                className="grow dark:text-black"
                {...register("name", { required: true })}
                placeholder="Nom :"
              />
            </label>
            {errors.name && <span>Ce champ est requis</span>}

            <label className="input input-bordered flex items-center gap-2 mb-3">
              <input
                type="text"
                className="grow dark:text-black"
                {...register("logo_url", { required: true })}
                placeholder="Logo URL :"
              />
            </label>
            {errors.logo_url && <span>Ce champ est requis</span>}

            <label className="input input-bordered flex items-center gap-2 mb-3">
              <input
                type="text"
                className="grow dark:text-black"
                {...register("address", { required: true })}
                placeholder="Adresse :"
              />
            </label>
            {errors.address && <span>Ce champ est requis</span>}
            <div className="flex flex-col items-end">
              {!isSubmit ? (
                <button className="btn ml-auto" type="submit">
                  Sauvegarder
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
