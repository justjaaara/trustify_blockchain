"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import FormField from "@/components/FormField";

type VerificationStatus = "idle" | "verifying" | "success" | "error";

export default function VerificarPage() {
  const [verificationType, setVerificationType] = useState<"id" | "file">("id");
  const [certificateId, setCertificateId] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCertificateFile(file);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationType === "id" && !certificateId.trim()) {
      setError("Por favor, ingresa un ID de certificado válido");
      return;
    }

    if (verificationType === "file" && !certificateFile) {
      setError("Por favor, selecciona un archivo de certificado");
      return;
    }

    setError("");
    setStatus("verifying");

    try {
      // Simulación de verificación en blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Para propósitos de demostración, simulamos una respuesta exitosa cuando:
      // - El ID comienza con "cert-"
      // - O cuando hay un archivo subido
      if (
        (verificationType === "id" && certificateId.startsWith("cert-")) ||
        (verificationType === "file" && certificateFile)
      ) {
        // Simulación de datos de certificado válido
        setVerificationResult({
          isValid: true,
          certificate: {
            id: verificationType === "id" ? certificateId : "cert-file-001",
            title: "Certificado de Curso de Blockchain",
            issuer: "Academia Blockchain",
            issuer_id: "0x1234...5678",
            recipient: "Ana García",
            date: "2025-03-15",
            transactionHash: "0xabcd...ef12",
            blockNumber: 12345678,
          },
        });
        setStatus("success");
      } else {
        setVerificationResult({
          isValid: false,
          reason:
            "El certificado no está registrado en la blockchain o el ID es inválido.",
        });
        setStatus("error");
      }
    } catch (err) {
      console.error("Error al verificar el certificado:", err);
      setStatus("error");
      setError(
        "Ocurrió un error durante la verificación. Por favor, intenta nuevamente."
      );
    }
  };

  const renderVerificationResult = () => {
    if (status !== "success" && status !== "error") return null;

    if (!verificationResult.isValid) {
      return (
        <div className="mt-8 p-6 bg-red-900/20 border border-red-500/50 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="mr-3 bg-red-900/30 p-2 rounded-full">
              <svg
                className="w-6 h-6 text-red-500"
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
            </div>
            <h3 className="text-xl font-bold text-red-500">
              Certificado No Verificado
            </h3>
          </div>
          <p className="text-gray-300">{verificationResult.reason}</p>
          <div className="mt-4">
            <Link href="/crear">
              <Button variant="primary">Crear un certificado</Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-8 p-6 bg-green-900/20 border border-green-500/50 rounded-lg">
        <div className="flex items-center mb-4">
          <div className="mr-3 bg-green-900/30 p-2 rounded-full">
            <svg
              className="w-6 h-6 text-green-500"
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
          </div>
          <h3 className="text-xl font-bold text-green-500">
            Certificado Verificado
          </h3>
        </div>

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-gray-300">
                ID del Certificado
              </span>
              <span className="font-mono">
                {verificationResult.certificate.id}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-300">Título</span>
              <span>{verificationResult.certificate.title}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-300">Emisor</span>
              <span>{verificationResult.certificate.issuer}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-300">ID del Emisor</span>
              <span className="font-mono">
                {verificationResult.certificate.issuer_id}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-300">Destinatario</span>
              <span>{verificationResult.certificate.recipient}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-300">
                Fecha de Emisión
              </span>
              <span>{verificationResult.certificate.date}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <h4 className="text-sm font-semibold mb-2">
              Información de Blockchain:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-gray-300">
                  Hash de Transacción
                </span>
                <span className="font-mono text-xs">
                  {verificationResult.certificate.transactionHash}
                </span>
              </div>
              <div>
                <span className="block text-xs text-gray-300">
                  Número de Bloque
                </span>
                <span className="font-mono">
                  {verificationResult.certificate.blockNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href={`/certificados/${verificationResult.certificate.id}`}>
            <Button variant="primary">Ver certificado completo</Button>
          </Link>
        </div>
      </div>
    );
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

        <form onSubmit={handleVerify}>
          {verificationType === "id" ? (
            <div className="mb-6">
              <FormField
                label="ID del Certificado"
                id="certificateId"
                name="certificateId"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="ej. cert-123"
                required
              />
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Archivo del Certificado
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="file"
                accept=".pdf,.json"
                onChange={handleFileChange}
                className="w-full text-gray-300 bg-gray-900 rounded border border-gray-700 px-3 py-2"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Formatos aceptados: PDF, JSON
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={status === "verifying"}
            className="w-full"
          >
            {status === "verifying" ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                Verificando...
              </div>
            ) : (
              "Verificar Certificado"
            )}
          </Button>
        </form>

        {renderVerificationResult()}
      </div>
    </div>
  );
}
