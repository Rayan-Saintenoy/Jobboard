"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdvertisementById, submitJobApplication } from "./action";

type DetailledAdvertisementsProps = {
  idAdvertisement: string;
};

type Advertisement = {
  id: string;
  title: string;
  post_date: Date;
  description: string;
  salary: string;
  place: string;
  working_time: string;
  skills: string[];
  company: {
    id: string;
    name: string;
  };
};

export default function DetailledAdvertisement({
  idAdvertisement,
}: DetailledAdvertisementsProps) {
  const { data: session } = useSession();
  const [advertisement, setAdvertisement] = useState<Advertisement>();

  const [toastError, setToastError] = useState(false);
  const [toastSuccess, setToastSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchAdvertisement = async () => {
      const data = await getAdvertisementById(idAdvertisement);
      setAdvertisement(data);
    };

    fetchAdvertisement();
  }, [idAdvertisement]);

  const formattedDate = new Date(
    advertisement?.post_date ?? ""
  ).toLocaleDateString("fr-FR");

  const handleSubmit = async () => {
    if (advertisement?.id) {
      const res = await submitJobApplication(advertisement.id);
      //   console.log("message: ", res?.message, "status: ", res?.status);

      if (res?.status !== "success") {
        setToastError(true);
        setToastMessage("Vous avez déjà postulé à cet offre");

        setTimeout(() => {
          setToastError(false);
        }, 3000);
      } else {
        setToastSuccess(true);
        setToastMessage("Vous avez postulé à l'offre avec succès");
        setTimeout(() => {
          setToastSuccess(false);
        }, 3000);
      }
    }
  };

  return (
    <>
      {idAdvertisement && (
        <div className="flex flex-col py-3">
          <h1 className="font-extrabold text-2xl">{advertisement?.title}</h1>
          <div className="py-7">
            <p>
              <span className="font-bold">Posté le </span>
              {formattedDate}
            </p>
            <p>
              <span className="font-bold">Par </span>
              <Link className="hover:underline text-blue-500" href={"/"}>
                {advertisement?.company.name}
              </Link>
            </p>
            <p>
              <span className="font-bold">Salaire : </span>
              {advertisement?.salary}€
            </p>
            <p>
              <span className="font-bold">Ville : </span>
              {advertisement?.place}
            </p>
            <p>
              <span className="font-bold">Temps de travail : </span>
              {advertisement?.working_time}h
            </p>
          </div>
          <p className="">{advertisement?.description}</p>
          <div className="mt-4">
            <h2 className="font-bold">Compétences requises :</h2>
            <ul className="flex flex-wrap gap-2 mt-2">
              {advertisement?.skills.map((skill, index) => (
                <li key={index} className="bg-gray-200 px-2 py-1 rounded">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          {/* modal */}
          <button
            className="btn btn-info m-4"
            onClick={() =>
              (
                document.getElementById("confirm_modal") as HTMLDialogElement
              ).showModal()
            }
          >
            Postuler
          </button>
          {session !== null ? (
            <dialog
              id="confirm_modal"
              className="modal modal-bottom sm:modal-middle"
            >
              <div className="modal-box">
                <h3 className="font-bold text-lg">Postuler</h3>
                <p className="py-4">
                  Etes vous sûr de vouloir postuler à cette offre
                </p>
                <div className="modal-action">
                  <form method="dialog" className="flex gap-4">
                    <button
                      onClick={() => handleSubmit()}
                      className="btn bg-green-300"
                    >
                      confirmer
                    </button>
                    <button className="btn bg-red-300">Fermer</button>
                  </form>
                </div>
              </div>
            </dialog>
          ) : (
            <dialog
              id="confirm_modal"
              className="modal modal-bottom sm:modal-middle"
            >
              <div className="modal-box">
                <h3 className="font-bold text-lg">Postuler</h3>
                <p className="py-4">
                  Vous devez créer un compte et vous connecter pour postuler à
                  cette offre
                </p>
                <div className="modal-action">
                  <form method="dialog" className="flex gap-4">
                    <Link href={"/auth"}>
                      <button className="btn btn-info">S&apos;inscrire</button>
                    </Link>
                  </form>
                </div>
              </div>
            </dialog>
          )}
        </div>
      )}

      {toastError && (
        <div className="toast">
          <div className="alert alert-error">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      {toastSuccess && (
        <div className="toast">
          <div className="alert alert-info">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
