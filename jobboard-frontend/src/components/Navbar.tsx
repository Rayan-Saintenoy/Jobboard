import gopher_img from "@/assets/images/gopher-logo.png";
import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="navbar bg-gray-300 py-4 px-10 sm:px-24 justify-between">
      <div>
        <Link
          href={"/"}
          className="hover:scale-110 hover:transition-transform transition-transform"
        >
          <div className="flex gap-5 items-center">
            <Image src={gopher_img} alt="gopher logo" width={60} height={60} />
            <span className="font-extrabold text-lg md:text-2xl">
              Find work
            </span>
          </div>
        </Link>
      </div>
      <div className="flex gap-5">
        {session?.user && (
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-outline btn-info rounded-2xl md:px-5 text-xs md:text-lg font-bold"
            >
              Mon compte
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content text-center menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <Link href={"/profile"}>Mon profil</Link>
              </li>
              {session?.user?.isRecruiter && (
                <li>
                  <Link href={"/panel/recruiter"}>Panel recruteur</Link>
                </li>
              )}
              {session?.user?.isAdmin && (
                <li>
                  <Link href={"/panel/admin"}>Panel admin</Link>
                </li>
              )}
            </ul>
          </div>
        )}

        {session ? (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              className="btn btn-outline btn-error rounded-2xl md:px-5 text-xs md:text-lg font-bold"
              type="submit"
            >
              Se deconnecter
            </button>
          </form>
        ) : (
          <Link href={"/auth"}>
            <button className="btn btn-info rounded-2xl md:px-5 text-xs md:text-lg font-bold">
              Se connecter
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
