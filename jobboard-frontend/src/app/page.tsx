import bg_green from "@/assets/images/green-background.svg";
import {
  calculCountOfPages,
  getAdvertisementsCount,
} from "@/components/Advertisements/action";
import Advertisements from "@/components/Advertisements/Advertisement";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Go find work",
  description: "You will find your job",
};

export default async function Home() {
  const countOfPage = await calculCountOfPages();
  const nbOfAdvertisements = await getAdvertisementsCount();

  return (
    <>
      <div className="relative w-full h-full">
        <Image
          alt="bg-green"
          src={bg_green}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col gap-7 items-center justify-center text-white">
          <h1 className="text-4xl font-bold">Bienvenue sur GO find work</h1>
          <p className="text-lg">
            Le site de recherche d&apos;emploi dans l&apos;univers de la tech
          </p>
          <p className="text-lg font-bold">
            Nombre d&apos;offres d&apos;emploi displonible :{" "}
            {nbOfAdvertisements}
          </p>
        </div>
      </div>
      <Advertisements countOfPage={countOfPage} />
    </>
  );
}
