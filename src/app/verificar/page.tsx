"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import { useWeb3 } from "@/lib/web3";
import { usePrivy } from "@privy-io/react-auth";

type VerificationStatus = "idle" | "verifying" | "success" | "error";

interface VerificationResult {
  certificate: {
    id: string;
    title: string;
    issuer: string;
    recipient: string;
    date: string;
    imageUrl?: string;
  };
  blockchainData: {
    tokenId: string;
    issueDate: string;
    expirationDate: string | null;
    institution: string;
    ipfsHash: string;
    revoked: boolean;
    owner: string;
  };
}

// Función para obtener metadatos desde IPFS (simulada)
const getMetadataFromIPFS = async (ipfsHash: string): Promise<any> => {
  // En un entorno real, aquí recuperaríamos los datos de IPFS
  // Por ahora, simulamos con datos aleatorios
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    title: "Certificado de Blockchain Avanzado",
    issuer: "Academia Blockchain",
    recipient: "Ana García",
    description:
      "Completó satisfactoriamente el curso de desarrollo blockchain avanzado",
    skills: ["Solidity", "Smart Contracts", "DApps"],
    expirationDate: null,
    imageUrl: "/certificate-1.jpg",
    createdAt: "2025-01-15T10:30:00Z",
  };
};

export default function VerificarPage() {
  const [verificationType, setVerificationType] = useState<"id" | "file">("id");
  const [certificateId, setCertificateId] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("idle");
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = usePrivy();
  const web3 = useWeb3();

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertificateId(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCertificateFile(file);
  };

  const handleVerify = async () => {
    setVerificationStatus("verifying");
    setErrorMessage("");

    try {
      // Si no está conectado a la wallet, sugerir conectarse
      if (!web3.isReady) {
        login();
        throw new Error(
          "Por favor, conecta tu wallet para verificar certificados"
        );
      }

      let tokenId: number;

      if (verificationType === "id") {
        // Verificar por ID
        if (!certificateId.trim()) {
          throw new Error("Por favor, ingresa un ID de certificado válido");
        }
        tokenId = parseInt(certificateId);
      } else {
        // Verificar por archivo
        if (!certificateFile) {
          throw new Error("Por favor, selecciona un archivo de certificado");
        }

        // Leer el archivo y extraer el ID del certificado
        // Esta es una simulación, en producción se leería realmente el archivo
        await new Promise((resolve) => setTimeout(resolve, 500));
        tokenId = Math.floor(Math.random() * 100) + 1; // Simulando ID extraído del archivo
      }

      // Verificar en la blockchain
      const verificationData = await web3.verifyCertificate(tokenId);

      if (!verificationData.valid) {
        throw new Error(
          "El certificado no es válido o no existe en la blockchain"
        );
      }

      // Obtener metadatos desde IPFS
      const metadata = await getMetadataFromIPFS(
        verificationData.details.ipfsHash
      );

      // Crear el resultado de la verificación
      setVerificationResult({
        certificate: {
          id: tokenId.toString(),
          title: metadata.title,
          issuer: metadata.issuer,
          recipient: metadata.recipient,
          date: new Date(
            verificationData.details.issueDate
          ).toLocaleDateString(),
          imageUrl: metadata.imageUrl,
        },
        blockchainData: {
          tokenId: tokenId.toString(),
          issueDate: verificationData.details.issueDate,
          expirationDate: verificationData.details.expirationDate,
          institution: verificationData.details.institution,
          ipfsHash: verificationData.details.ipfsHash,
          revoked: verificationData.details.revoked,
          owner: verificationData.details.owner,
        },
      });

      setVerificationStatus("success");
    } catch (error: any) {
      console.error("Error al verificar el certificado:", error);
      setErrorMessage(
        error.message || "Ocurrió un error al verificar el certificado"
      );
      setVerificationStatus("error");
    }
  };

  const renderVerificationResult = () => {
    if (verificationStatus === "verifying") {
      return (
        <div className="mt-8 text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
          <div className="animate-spin mx-auto mb-4 h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          <p className="text-xl font-medium text-gray-300">
            Verificando certificado...
          </p>
        </div>
      );
    }

    if (verificationStatus === "error") {
      return (
        <div className="mt-8 text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <p className="mt-4 text-xl font-medium text-red-500">
            Error de verificación
          </p>
          <p className="mt-2 text-gray-400">{errorMessage}</p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setVerificationStatus("idle")}
          >
            Intentar nuevamente
          </Button>
        </div>
      );
    }

    if (verificationStatus === "success" && verificationResult) {
      return (
        <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="bg-green-900/20 border-b border-gray-700 p-4">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-green-500 mr-2"
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
              <span className="text-lg font-medium text-green-500">
                Certificado verificado con éxito
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">
                  Información del Certificado
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">ID del Certificado</p>
                    <p className="font-mono">
                      {verificationResult.certificate.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Título</p>
                    <p>{verificationResult.certificate.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Emisor</p>
                    <p>{verificationResult.certificate.issuer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Destinatario</p>
                    <p>{verificationResult.certificate.recipient}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Fecha de Emisión</p>
                    <p>{verificationResult.certificate.date}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">
                  Datos en Blockchain
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Hash IPFS</p>
                    <p className="font-mono text-sm truncate">
                      {verificationResult.blockchainData.ipfsHash}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">
                      Dirección del Propietario
                    </p>
                    <p className="font-mono text-sm truncate">
                      {verificationResult.blockchainData.owner}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Fecha de Expiración</p>
                    <p>
                      {verificationResult.blockchainData.expirationDate
                        ? new Date(
                            verificationResult.blockchainData.expirationDate
                          ).toLocaleDateString()
                        : "No expira"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Estado</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        verificationResult.blockchainData.revoked
                          ? "bg-red-900/20 text-red-500"
                          : "bg-green-900/20 text-green-500"
                      }`}
                    >
                      {verificationResult.blockchainData.revoked
                        ? "Revocado"
                        : "Activo"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Verificar Certificado</h1>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
        <h2 className="text-xl font-bold mb-4">
          ¿Cómo verificar un certificado?
        </h2>
        <p className="text-gray-300 mb-4">
          Puedes verificar la autenticidad de un certificado de dos formas:
        </p>
        <ul className="list-disc pl-5 text-gray-300 space-y-2">
          <li>Ingresando el ID único del certificado</li>
          <li>Subiendo el archivo del certificado (PDF, JSON)</li>
        </ul>
        <div className="mt-4 bg-gray-900 p-4 rounded-md border border-gray-700">
          <p className="text-sm text-gray-300">
            <strong className="text-blue-500">Nota:</strong> La verificación
            consulta directamente a la blockchain para comprobar la validez del
            certificado.
          </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setVerificationType("id")}
              className={`px-4 py-2 rounded-md ${
                verificationType === "id"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Verificar por ID
            </button>
            <button
              type="button"
              onClick={() => setVerificationType("file")}
              className={`px-4 py-2 rounded-md ${
                verificationType === "file"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Verificar por Archivo
            </button>
          </div>
        </div>

        {verificationType === "id" ? (
          <div className="mb-4">
            <FormField
              label="ID del Certificado"
              id="certificateId"
              value={certificateId}
              onChange={handleIdChange}
              placeholder="Ingresa el ID único del certificado"
              required
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Archivo del Certificado
            </label>
            <input
              type="file"
              accept=".pdf,.json"
              onChange={handleFileChange}
              className="w-full bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-base outline-none text-gray-300 py-2 px-3 transition-colors duration-200"
            />
            <p className="mt-1 text-sm text-gray-400">
              Formatos aceptados: PDF, JSON
            </p>
          </div>
        )}

        <div className="mt-6">
          <Button
            variant="primary"
            onClick={handleVerify}
            disabled={
              verificationStatus === "verifying" ||
              web3.isInitializing ||
              (!web3.isReady && !web3.isInitializing)
            }
          >
            {verificationStatus === "verifying" ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                <span>Verificando...</span>
              </div>
            ) : web3.isInitializing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                <span>Verificando wallet...</span>
              </div>
            ) : !web3.isReady ? (
              "Conectar wallet para verificar"
            ) : (
              "Verificar Certificado"
            )}
          </Button>
        </div>

        {!web3.isReady &&
          !web3.isInitializing &&
          verificationStatus === "idle" && (
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/50 text-blue-500 rounded-md">
              Necesitas conectar tu wallet para verificar certificados. Haz clic
              en "Conectar Wallet" en la barra de navegación.
            </div>
          )}

        {web3.isReady && verificationStatus === "idle" && (
          <div className="mt-4 p-4 bg-green-900/20 border border-green-500/50 text-green-500 rounded-md">
            Wallet conectada: {web3.address}
          </div>
        )}

        {renderVerificationResult()}
      </div>
    </div>
  );
}
