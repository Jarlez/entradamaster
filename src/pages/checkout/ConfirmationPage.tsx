// src/pages/confirmation.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";

const ConfirmationPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const userType =
      typeof window !== "undefined" && localStorage.getItem("userType");
    if (!userType || userType !== "user") {
      router.push("/login");
    }
  }, []);

  const handleDownload = () => {
    alert("Simulación de descarga de la entrada.");
  };

  const share = (platform: string) => {
    const url = encodeURIComponent("https://seusite.com/confirmation");
    const text = encodeURIComponent("¡Acabo de comprar mi entrada! 🎟️");
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text} ${url}`;
        break;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <h1 className="mb-2 text-3xl font-bold text-[#FF5F00]">
        ¡Compra realizada con éxito!
      </h1>
      <p className="mb-6 text-gray-600">
        Gracias por tu compra. Tu entrada ya está lista para ser utilizada.
      </p>

      <div className="w-full max-w-md rounded-lg bg-gray-100 p-6 shadow-md">
        <div className="mb-4">
          <img
            src="https://via.placeholder.com/150"
            alt="QR Code Placeholder"
            className="mx-auto"
          />
          <p className="mt-2 text-sm text-gray-500">
            Escaneá este código QR en la entrada del evento
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="mb-4 w-full rounded-md bg-[#FF5F00] py-2 px-4 font-semibold text-white transition hover:opacity-90"
        >
          📥 Descargar entrada
        </button>

        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => share("facebook")}
            className="text-[#FF5F00] hover:opacity-80"
          >
            <FaFacebookF size={24} />
          </button>
          <button
            onClick={() => share("twitter")}
            className="text-[#FF5F00] hover:opacity-80"
          >
            <FaTwitter size={24} />
          </button>
          <button
            onClick={() => share("whatsapp")}
            className="text-[#FF5F00] hover:opacity-80"
          >
            <FaWhatsapp size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;

export async function getServerSideProps({ req }: any) {
  const userType = req.cookies.userType;

  if (userType !== "user") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
