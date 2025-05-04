"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";

// Simulación de datos para mostrar un certificado específico
const certificadoEjemplo = {
  id: "cert-001",
  title: "Certificado de Curso de Blockchain",
  issuer: "Academia Blockchain",
  issuer_id: "0x1234...5678",
  recipient: "Ana García",
  recipient_id: "0x8765...4321",
  date: "2025-03-15",
  expirationDate: "2030-03-15",
  description:
    "Este certificado verifica la finalización exitosa del curso avanzado de desarrollo blockchain, incluyendo smart contracts, DApps y seguridad en blockchain.",
  skills: [
    "Smart Contracts",
    "Solidity",
    "DApps",
    "Web3.js",
    "Seguridad Blockchain",
  ],
  transactionHash: "0xabcd...ef12",
  blockNumber: 12345678,
  timestamp: "2025-03-15T14:30:00Z",
  imageSrc: "/certificate-1.jpg", // Este archivo tendría que crearse posteriormente
};

export default function CertificadoDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const [certificado, setCertificado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "unverified" | "verified" | "failed"
  >("unverified");

  useEffect(() => {
    // Simulación de carga de datos del certificado
    const loadData = async () => {
      try {
        // Aquí iría la lógica para buscar el certificado por ID
        // Por ahora, usamos el ejemplo
        setTimeout(() => {
          setCertificado(certificadoEjemplo);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error al cargar los datos del certificado:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [params.id]);

  const handleVerify = () => {
    // Simulación de proceso de verificación
    setVerificationStatus("unverified");
    setTimeout(() => {
      // En un entorno real, se verificaría con blockchain
      setVerificationStatus("verified");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!certificado) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Certificado no encontrado</h1>
        <p className="mb-8 text-gray-300">
          El certificado que buscas no existe o ha sido eliminado.
        </p>
        <Link href="/certificados">
          <Button variant="primary">Ver todos los certificados</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/2">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
          <div className="relative aspect-[4/3] w-full bg-gray-700">
            {certificado.imageSrc ? (
              <Image
                src={certificado.imageSrc}
                alt={certificado.title}
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg
                  className="w-24 h-24 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:w-1/2">
        <h1 className="text-3xl font-bold mb-3">{certificado.title}</h1>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">ID del Certificado:</span>
            <span className="text-gray-300 font-mono">{certificado.id}</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">Emisor:</span>
            <span className="text-gray-300">{certificado.issuer}</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">ID del Emisor:</span>
            <span className="text-gray-300 font-mono">
              {certificado.issuer_id}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">Destinatario:</span>
            <span className="text-gray-300">{certificado.recipient}</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">ID del Destinatario:</span>
            <span className="text-gray-300 font-mono">
              {certificado.recipient_id}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">Fecha de Emisión:</span>
            <span className="text-gray-300">{certificado.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Fecha de Expiración:</span>
            <span className="text-gray-300">{certificado.expirationDate}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Descripción</h2>
          <p className="text-gray-300">{certificado.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Habilidades Certificadas</h2>
          <div className="flex flex-wrap gap-2">
            {certificado.skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Información de Blockchain</h2>
          <div className="bg-gray-800 rounded-md p-4 border border-gray-700">
            <div className="mb-2">
              <span className="font-semibold block mb-1">
                Hash de Transacción:
              </span>
              <code className="text-sm bg-gray-900 text-gray-300 p-1 rounded block break-all font-mono">
                {certificado.transactionHash}
              </code>
            </div>
            <div className="mb-2">
              <span className="font-semibold block mb-1">
                Número de Bloque:
              </span>
              <code className="text-sm bg-gray-900 text-gray-300 p-1 rounded block font-mono">
                {certificado.blockNumber}
              </code>
            </div>
            <div>
              <span className="font-semibold block mb-1">Timestamp:</span>
              <code className="text-sm bg-gray-900 text-gray-300 p-1 rounded block font-mono">
                {certificado.timestamp}
              </code>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant={
              verificationStatus === "unverified" ? "primary" : "outline"
            }
            onClick={handleVerify}
            className="flex items-center justify-center gap-2"
          >
            {verificationStatus === "unverified" ? (
              <>Verificar en Blockchain</>
            ) : verificationStatus === "verified" ? (
              <>
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Verificado
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                Error en verificación
              </>
            )}
          </Button>
          <Button variant="secondary">Descargar Certificado</Button>
        </div>
      </div>
    </div>
  );
}
