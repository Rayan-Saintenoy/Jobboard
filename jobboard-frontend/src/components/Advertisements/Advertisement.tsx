"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdvertisements } from "./action";
import DetailledAdvertisement from "./DetailledAdvertisement";

type Advertisement = {
  id: string;
  title: string;
  post_date: Date;
  short_description: string;
  company: {
    id: string;
    name: string;
  };
};

type AdvertisementsProps = {
  countOfPage: number;
};

export default function Advertisements({ countOfPage }: AdvertisementsProps) {
  const countOfPages = countOfPage;

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  const [idAdvertisement, setIdAdvertisement] = useState<string>("");

  useEffect(() => {
    const fetchAdvertisements = async () => {
      const data = await getAdvertisements(currentPage.toString());
      setAdvertisements(data);
    };

    fetchAdvertisements();
    setIsLoading(false);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // console.log(advertisements);

  return (
    <div className="py-3">
      <h3 className="text-4xl text-center font-bold">Liste des offres</h3>
      <div className="flex flex-wrap justify-between py-5 px-16">
        <div className="flex flex-col h-[600px] items-center gap-5">
          {isLoading ? (
            <span className="loading loading-dots loading-lg"></span>
          ) : (
            <div className="overflow-y-auto">
              <>
                {advertisements.map((advertisement) => {
                  const formattedDate = new Date(
                    advertisement.post_date
                  ).toLocaleDateString("fr-FR");
                  return (
                    <div
                      key={advertisement.id}
                      className="flex flex-col p-6 max-w-xl m-5 outline outline-2 hover:outline-4 outline-blue-500 rounded-lg"
                    >
                      <h1 className="font-extrabold text-xl">
                        {advertisement.title}
                      </h1>
                      <p>
                        <span className="font-bold">Posté le </span>
                        {formattedDate}
                      </p>
                      <p>
                        <span className="font-bold">Par </span>
                        <Link
                          className="hover:underline text-blue-500"
                          href={"/"}
                        >
                          {advertisement.company.name}
                        </Link>
                      </p>
                      <p className="p-5">{advertisement.short_description}</p>
                      <button
                        onClick={() => {
                          setIdAdvertisement(advertisement.id);
                        }}
                        className="btn btn-info self-end  "
                      >
                        En savoir plus
                      </button>
                    </div>
                  );
                })}
              </>
            </div>
          )}
          <div className="join">
            {Array.from({ length: countOfPages }, (_, index) => (
              <input
                key={index}
                className="join-item btn btn-square"
                type="radio"
                name="options"
                aria-label={`${index + 1}`}
                onClick={() => handlePageChange(index + 1)}
                defaultChecked={index === 0}
              />
            ))}
          </div>
        </div>
        <div className="max-w-xl h-[600px] overflow-y-auto">
          {idAdvertisement ? (
            <DetailledAdvertisement idAdvertisement={idAdvertisement} />
          ) : (
            <h1>Pas d&apos;offre séléctionné</h1>
          )}
        </div>
      </div>
    </div>
  );
}
