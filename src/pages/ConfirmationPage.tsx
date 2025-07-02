// src/pages/confirmation.tsx
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { QRCode } from "react-qrcode-logo";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../public/images/logo_white.png";

const ConfirmationPage: React.FC = () => {
  const router = useRouter();
  const qrRef = useRef<HTMLDivElement>(null);

  const { evento, data, setor, fila, assento, codigo } = router.query;

  const ticketData = {
    evento: (evento as string) || "Evento Desconocido",
    data: (data as string) || "Fecha no especificada",
    setor: (setor as string) || "-",
    fila: (fila as string) || "-",
    assento: (assento as string) || "-",
    codigo: (codigo as string) || "XXXX-XXXX",
  };

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "user") {
      router.push("/login");
    }
  }, [router]);

  const handleDownloadPDF = async () => {
    if (!qrRef.current) return;

    const canvas = await html2canvas(qrRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const logoImg = new Image();
    logoImg.src = "/images/logo_white.png";

    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("EntradaMaster", 20, 20);
    pdf.setFontSize(14);
    pdf.text(`Evento: ${ticketData.evento}`, 20, 40);
    pdf.text(`Data: ${ticketData.data}`, 20, 50);
    pdf.text(
      `Assento: Platea ${ticketData.setor} - Fila ${ticketData.fila} - Assento ${ticketData.assento}`,
      20,
      60
    );
    pdf.text(`Código: ${ticketData.codigo}`, 20, 70);
    pdf.addImage(imgData, "PNG", 20, 80, 80, 80);

    pdf.save("entrada.pdf");
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
    <motion.div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-2xl"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <CheckCircle
          className="mx-auto mb-4 text-green-500"
          size={64}
          strokeWidth={1.8}
        />

        <h1 className="mb-2 text-4xl font-extrabold text-[#FF5F00]">
          ¡Compra realizada con éxito!
        </h1>
        <p className="mb-8 text-lg text-gray-700">
          Gracias por tu compra. Tu entrada digital ya está lista. Mostrala en
          la puerta del evento.
        </p>

        <motion.div
          className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-2">
            <img
              src="/images/logo_white.png"
              alt="Logo EntradaMaster"
              className="mx-auto h-10 object-contain"
            />
          </div>
          <h2 className="text-xl font-semibold">{ticketData.evento}</h2>
          <p className="text-sm text-gray-500">{ticketData.data}</p>
          <hr className="my-3" />
          <p className="text-md font-medium text-gray-700">
            Platea {ticketData.setor}
          </p>
          <p className="text-sm text-gray-500">
            Fila {ticketData.fila} – Asiento {ticketData.assento}
          </p>

          <div ref={qrRef} className="my-4 flex justify-center">
            <QRCode value={ticketData.codigo} size={140} ecLevel="H" />
          </div>

          <div className="rounded bg-[#FF5F00] py-2 font-semibold text-white">
            Código: {ticketData.codigo}
          </div>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleDownloadPDF}
          className="mb-8 w-full rounded-full bg-[#FF5F00] py-3 text-lg font-bold text-white shadow-md transition"
        >
          📥 Descargar entrada
        </motion.button>

        <div className="mb-2 text-sm text-gray-600">
          ¿Querés compartir tu emoción?
        </div>
        <motion.div
          className="flex justify-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button onClick={() => share("facebook")} aria-label="Facebook">
            <FaFacebookF
              size={24}
              className="text-[#3b5998] transition-transform hover:scale-110"
            />
          </button>
          <button onClick={() => share("twitter")} aria-label="Twitter">
            <FaTwitter
              size={24}
              className="text-[#1da1f2] transition-transform hover:scale-110"
            />
          </button>
          <button onClick={() => share("whatsapp")} aria-label="Whatsapp">
            <FaWhatsapp
              size={24}
              className="text-[#25d366] transition-transform hover:scale-110"
            />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationPage;
