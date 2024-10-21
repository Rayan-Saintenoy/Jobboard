"use client";

import Connexion from "@/components/Connexion";
import Inscription from "@/components/Inscription/Inscription";
import { useState } from "react";

const AuthPage = () => {
  const [isSignInForm, setIsSignInForm] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-5 items-center justify-center">
        <div>
          <div className="form-control flex flex-row items-center gap-4">
            <span className="label-text font-semibold">Inscription</span>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="toggle toggle-lg toggle-primary"
                checked={isSignInForm}
                onChange={(e) => setIsSignInForm(e.target.checked)}
              />
            </label>
            <span className="label-text font-semibold">Connexion</span>
          </div>
        </div>

        {isSignInForm ? <Connexion /> : <Inscription />}
      </div>
    </>
  );
};

export default AuthPage;
