import React, { useEffect, useState } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

interface CompleteData {
  name: string;
  DNIName: string;
  DNI: string;
  phone: string;
  birthdate: string;
}

const Auth: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: profile, isLoading: isProfileLoading } =
    trpc.auth.getProfile.useQuery();

  const [finishRegister, setFinishRegister] = useState(false);
  const [name, setName] = useState("");
  const [DNIName, setDNIName] = useState("");
  const [DNI, setDNI] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [validationErrorAlert, setValidationErrorAlert] = useState(false);

  const completeData = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      createNotificationHandler();
      router.push("/");
    },
  });

  const createNotification = trpc.notification.createNotification.useMutation();
  const createNotificationHandler = () => {
    createNotification.mutate({
      title: "¡Acabas de crear tu cuenta con exito!",
      description: "Encuentra tus eventos favoritos",
    });
  };

  const onSave = (data: CompleteData) => {
    completeData.mutate(data);
  };

  const handleFormValidation = (data: CompleteData): void => {
    const allFieldsFilled = Object.values(data).every((v) => v !== "");
    if (allFieldsFilled) {
      onSave(data);
    } else {
      setValidationErrorAlert(true);
    }
  };

  useEffect(() => {
    if (session && profile?.name && profile?.phone) {
      router.replace("/");
    }
  }, [router, session, profile]);

  if (status === "loading" || isProfileLoading) return null;
  if (!session) return null;

  return (
    <div>
      <div
        className="hero h-screen"
        style={{
          backgroundImage: `url("https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
        }}
      >
        <div className="hero-overlay bg-black bg-opacity-60" />
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-lg">
            {!finishRegister ? (
              <>
                <h1 className="mb-5 text-4xl font-bold">
                  ¡No esperes más, adquiere tus entradas hoy!
                </h1>
                <p className="mb-5">
                  Al utilizar nuestros servicios, usted acepta y reconoce haber
                  leído y entendido nuestros términos y condiciones
                </p>
                <button
                  className="btn-warning btn"
                  onClick={() => setFinishRegister(true)}
                >
                  Empieza Ahora
                </button>
              </>
            ) : (
              <>
                <h1 className="mb-5 text-4xl font-bold">
                  Completa tu información
                </h1>
                <div className="card w-full flex-shrink-0 bg-base-100 shadow-2xl">
                  <div className="card-body">
                    {validationErrorAlert && (
                      <div className="alert alert-error shadow-lg">
                        <span>¡Error! Rellena los datos faltantes</span>
                      </div>
                    )}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Nombre de usuario</span>
                      </label>
                      <input
                        type="text"
                        className="input-bordered input text-black"
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Nombre completo</span>
                      </label>
                      <input
                        type="text"
                        className="input-bordered input text-black"
                        value={DNIName}
                        onChange={(e) => setDNIName(e.currentTarget.value)}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">DNI</span>
                      </label>
                      <input
                        type="number"
                        className="input-bordered input text-black"
                        value={DNI}
                        onChange={(e) => setDNI(e.currentTarget.value)}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Teléfono</span>
                      </label>
                      <input
                        type="number"
                        className="input-bordered input text-black"
                        value={phone}
                        onChange={(e) => setPhone(e.currentTarget.value)}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Fecha de nacimiento</span>
                      </label>
                      <input
                        type="date"
                        className="input-bordered input text-black"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.currentTarget.value)}
                        required
                      />
                    </div>
                    <div className="form-control mt-6">
                      <button
                        className="btn-warning btn"
                        onClick={() =>
                          handleFormValidation({
                            name,
                            DNIName,
                            DNI,
                            phone,
                            birthdate,
                          })
                        }
                      >
                        Finalizar registro
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
