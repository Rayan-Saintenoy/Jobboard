type Advertisement = {
  id: string;
  title: string;
  post_date: string;
  description: string;
  salary: string;
  place: string;
  working_time: number;
  skills: string[];
};

type JobApplication = {
  id: string;
  advertisements: Advertisement;
};

type JobApplicationsProps = {
  jobApplications: JobApplication[];
};

export async function UserJobApplication({
  jobApplications,
}: JobApplicationsProps) {
  const userJobApplications = jobApplications;

  // console.log(userJobApplications);

  return (
    <div>
      <h2 className="text-center text-xl font-bold py-3">
        Les offres auquel vous avez postulé
      </h2>
      {userJobApplications.length === 0 ? (
        <p className="text-center text-lg">
          Vous n&apos;avez postulé à aucune offre.
        </p>
      ) : (
        <div className="flex flex-col items-center">
          {userJobApplications.map((application) => {
            const { id, advertisements } = application;
            const formattedDate = new Date(
              advertisements.post_date
            ).toLocaleDateString("fr-FR");

            return (
              <div
                key={id}
                className="border-2 border-blue-700 rounded-xl p-7 flex flex-col items-center mb-4 max-w-4xl"
              >
                <div className="w-full flex justify-between">
                  <h3 className="text-lg font-semibold">
                    {advertisements.title}
                  </h3>
                  <p className="text-lg">Posté le : {formattedDate}</p>
                </div>
                <div className="p-4 text-sm">
                  <p>{advertisements.description}</p>
                </div>
                <div className="self-start pl-4">
                  <p>
                    <span className="font-bold">Salaire : </span>
                    {advertisements.salary}€
                  </p>
                  <p>
                    <span className="font-bold">Ville : </span>
                    {advertisements.place}
                  </p>
                  <p>
                    <span className="font-bold">Temps de travail : </span>
                    {advertisements.working_time}h
                  </p>
                </div>
                <div className="flex gap-3">
                  {advertisements.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-500 text-white py-2 px-3 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
