"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { deleteAdvertisement, updateAdvertisement } from "./action";

type AdvertisementData = {
  id: string;
  title: string;
  post_date: string;
  description: string;
  salary: string;
  place: string;
  working_time: number;
  skills: string[];
  jobApplications: {
    id: string;
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      phoneNumber: string;
    };
  }[];
};

type AdvertisementProps = {
  advertisements: AdvertisementData[];
};

export default function CompanyAdvertisements({
  advertisements,
}: AdvertisementProps) {
  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    event.preventDefault();
    setIsSubmit(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      salary: Number(formData.get("salary")),
      place: formData.get("place") as string,
      working_time: Number(formData.get("working_time")),
      skills: formData.get("skills") as string,
    };

    console.log("data from form", data);

    const response = await updateAdvertisement(id, data);

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

  const handleSubmitForDelete = async (
    event: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    event.preventDefault();
    const response = await deleteAdvertisement(id);

    if (response?.status !== "success") {
      toast.error(response?.message || "Une erreur est survenue.");
    } else {
      toast.success("Annonce supprimé avec succes", {
        icon: "👍",
        duration: 4000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-10">
      <h2 className="text-3xl font-bold">Liste des offres</h2>
      <div className="h-[600px] overflow-y-auto w-full border-2">
        <div className="flex flex-col gap-3 px-6">
          {advertisements.map((advertisement, index) => {
            const formattedDate = new Date(
              advertisement.post_date
            ).toLocaleDateString("fr-FR");

            const formattedSkills = advertisement.skills.join(", ");

            return (
              <div key={index}>
                <div className="collapse collapse-arrow bg-base-200">
                  <input type="radio" name="my-accordion" />
                  <div className="collapse-title text-xl font-bold">
                    {advertisement.title}{" "}
                    <span className="font-normal">
                      | publié le {formattedDate}
                    </span>
                  </div>
                  <div className="collapse-content">
                    <div className="flex justify-center gap-3">
                      <div className="w-2/4">
                        <form
                          onSubmit={(event) =>
                            handleSubmit(event, advertisement.id)
                          }
                        >
                          <div className="grid grid-cols-1 gap-6">
                            <div className="form-control">
                              <div className="label">
                                <span className="label-text">Titre</span>
                              </div>
                              <input
                                className="input input-bordered w-full"
                                type="text"
                                name="title"
                                defaultValue={advertisement.title}
                                placeholder="Titre"
                              />
                            </div>
                            <div className="form-control">
                              <div className="label">
                                <span className="label-text">Description</span>
                              </div>
                              <textarea
                                className="textarea textarea-bordered textarea-sm w-full h-48"
                                defaultValue={advertisement.description}
                                placeholder="Description"
                                name="description"
                              />
                            </div>
                            <div className="form-control">
                              <div className="label">
                                <span className="label-text">Salaire</span>
                              </div>
                              <input
                                className="input input-bordered w-full"
                                type="number"
                                name="salary"
                                defaultValue={advertisement.salary}
                                placeholder="Salaire"
                              />
                            </div>
                            <div className="form-control">
                              <div className="label">
                                <span className="label-text">Ville</span>
                              </div>
                              <input
                                className="input input-bordered w-full"
                                type="text"
                                name="place"
                                defaultValue={advertisement.place}
                                placeholder="Ville"
                              />
                            </div>
                            <div className="form-control">
                              <div className="label">
                                <span className="label-text">
                                  Temps de travail
                                </span>
                              </div>
                              <input
                                className="input input-bordered w-full"
                                type="number"
                                name="working_time"
                                defaultValue={advertisement.working_time}
                                placeholder="Temps de travail"
                              />
                            </div>
                            <div className="form-control">
                              <div className="label">
                                <span className="label-text">Compétences</span>
                              </div>
                              <input
                                className="input input-bordered w-full"
                                type="text"
                                name="skills"
                                defaultValue={formattedSkills}
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
                                Sauvegarder
                              </button>
                            )}
                          </div>
                        </form>

                        <form
                          onSubmit={(event) =>
                            handleSubmitForDelete(event, advertisement.id)
                          }
                        >
                          <button className="w-full btn btn-error btn-outline">
                            Supprimer
                          </button>
                        </form>
                      </div>
                      <div>
                        <h2 className="text-center font-bold text-lg">
                          Liste des postulants
                        </h2>

                        <div className="overflow-y-auto max-h-[300px]">
                          {advertisement.jobApplications.length !== 0 ? (
                            <div className="max-h-[500px] overflow-x-auto overflow-y-auto">
                              <table className="table table-lg table-pin-rows table-zebra-zebra">
                                {/* head */}
                                <thead>
                                  <tr>
                                    <th>Prénom</th>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Téléphone</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {advertisement.jobApplications.map(
                                    (application, index) => (
                                      <tr key={index}>
                                        <th>{application.user.firstname}</th>
                                        <td>{application.user.lastname}</td>
                                        <td>{application.user.email}</td>
                                        <td>{application.user.phoneNumber}</td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p>Aucun postulant</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
