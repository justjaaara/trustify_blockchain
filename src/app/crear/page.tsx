"use client";

import { useState, useEffect } from "react";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import Link from "next/link";
import { useWeb3 } from "@/lib/web3";
import { usePrivy } from "@privy-io/react-auth";

// Función para subir archivos a IPFS (simulada por ahora)
const uploadToIPFS = async (file: File): Promise<string> => {
  // En un entorno real, aquí subiríamos el archivo a IPFS
  // Por ahora, simulamos el proceso devolviendo un hash aleatorio
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `bafybeih${Math.random().toString(36).substring(2, 15)}`;
};

// Función para generar un objeto JSON con los metadatos del certificado
const generateMetadata = (formData: any, ipfsImageUrl: string | null): any => {
  return {
    title: formData.title,
    issuer: formData.issuer,
    recipient: formData.recipient,
    recipientEmail: formData.recipientEmail,
    description: formData.description,
    skills: formData.skills
      ? formData.skills.split(",").map((s: string) => s.trim())
      : [],
    expirationDate: formData.expirationDate || null,
    imageUrl: ipfsImageUrl,
    createdAt: new Date().toISOString(),
  };
};

export default function CrearCertificadoPage() {
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    recipient: "",
    recipientEmail: "",
    description: "",
    expirationDate: "",
    skills: "",
    recipientAddress: "", // Dirección de wallet del receptor
  });

  const [certificateImage, setCertificateImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [newCertificateId, setNewCertificateId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { login } = usePrivy();
  const web3 = useWeb3();

  // Log para diagnosticar el estado de la conexión de la wallet
  useEffect(() => {
    console.log("Estado de la wallet en Crear Certificado:", {
      isReady: web3.isReady,
      isInitializing: web3.isInitializing,
      address: web3.address,
      error: web3.error,
      user: web3.user
        ? {
            wallets: web3.user.wallets
              ? web3.user.wallets.map((w) => ({
                  type: w.walletClientType,
                  connected: w.connected,
                  address: w.address,
                }))
              : "No wallets",
          }
        : "No user",
    });
  }, [web3.isReady, web3.isInitializing, web3.address, web3.error, web3.user]);

  // Función para forzar la recarga del estado de la wallet
  const handleRefreshWalletStatus = async () => {
    setIsRefreshing(true);
    try {
      // Llamamos a la función correcta del hook useWeb3
      await web3.forceWalletCheck();
      console.log("Estado de wallet actualizado:", {
        isReady: web3.isReady,
        address: web3.address,
      });
    } catch (error) {
      console.error("Error al refrescar el estado de la wallet:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCertificateImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    setErrorMessage("");

    try {
      // Verifica si el usuario está conectado con su wallet
      if (!web3.isReady) {
        login();
        throw new Error("Por favor, conecta tu wallet primero");
      }

      // 1. Subir la imagen a IPFS si existe
      let imageIpfsHash = null;
      if (certificateImage) {
        imageIpfsHash = await uploadToIPFS(certificateImage);
      }

      // 2. Crear los metadatos del certificado
      const metadata = generateMetadata(formData, imageIpfsHash);

      // 3. Subir los metadatos a IPFS
      const metadataIpfsHash = await uploadToIPFS(
        new File([JSON.stringify(metadata)], "metadata.json", {
          type: "application/json",
        })
      );

      // 4. Determinar la fecha de expiración para la blockchain (en timestamp UNIX)
      const expirationTimestamp = formData.expirationDate
        ? Math.floor(new Date(formData.expirationDate).getTime() / 1000)
        : 0;

      // 5. Emitir el certificado en la blockchain
      const result = await web3.issueCertificate(
        formData.recipientAddress,
        metadataIpfsHash,
        Math.floor(Math.random() * 1000000), // ID aleatorio para el ejemplo
        expirationTimestamp
      );

      // 6. Actualizar la UI con el ID del certificado creado
      setNewCertificateId(result.tokenId.toString());
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Error al crear el certificado:", error);
      setIsError(true);
      setErrorMessage(
        error.message || "Error al crear el certificado. Inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && newCertificateId) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">
          ¡Certificado creado con éxito!
        </h1>
        <p className="mb-8 text-lg text-light-darker">
          Tu certificado ha sido creado y registrado en la blockchain. El ID del
          certificado es:
          <span className="font-mono font-bold block mt-2">
            {newCertificateId}
          </span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/certificados/${newCertificateId}`}>
            <Button variant="primary">Ver certificado</Button>
          </Link>
          <Link href="/certificados">
            <Button variant="outline">Ver todos los certificados</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Certificado</h1>

      <div className="bg-dark-lighter p-6 rounded-lg border border-dark-lightest mb-8">
        <h2 className="text-xl font-bold mb-4">Instrucciones</h2>
        <p className="text-light-darker mb-4">
          Completa el siguiente formulario para crear un nuevo certificado
          digital verificable en blockchain. Una vez creado, podrás compartirlo
          con el destinatario y cualquier persona podrá verificar su
          autenticidad.
        </p>
        <div className="bg-dark p-4 rounded-md border border-dark-lightest">
          <p className="text-sm text-light-darker">
            <strong className="text-primary">Nota:</strong> Los certificados
            creados son inmutables una vez registrados en la blockchain.
            Asegúrate de revisar toda la información antes de finalizar.
          </p>
        </div>
      </div>

      {/* Sección de estado de la wallet */}
      <div className="mb-6">
        {web3.isReady ? (
          <div className="p-4 bg-green-900/20 border border-green-500/50 text-green-500 rounded-md flex justify-between items-center">
            <span>Wallet conectada: {web3.address}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshWalletStatus}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-green-500 rounded-full"></div>
                  <span>Actualizando...</span>
                </div>
              ) : (
                <span>Actualizar conexión</span>
              )}
            </Button>
          </div>
        ) : web3.isInitializing ? (
          <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 text-yellow-500 rounded-md flex items-center justify-between">
            <span>Verificando estado de la wallet...</span>
            <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-yellow-500 rounded-full"></div>
          </div>
        ) : (
          <div className="p-4 bg-blue-900/20 border border-blue-500/50 text-blue-500 rounded-md flex justify-between items-center">
            <span>
              Necesitas conectar tu wallet para poder crear certificados.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                login();
                setTimeout(() => handleRefreshWalletStatus(), 2000);
              }}
            >
              Conectar Wallet
            </Button>
          </div>
        )}

        {/* Si ya estás conectado pero el sistema no lo detecta, muestra un botón de reintentar */}
        {!web3.isReady && !web3.isInitializing && (
          <div className="mt-3 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshWalletStatus}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-primary rounded-full"></div>
                  <span>Verificando conexión...</span>
                </div>
              ) : (
                <span>
                  ¿Ya conectaste tu wallet? Haz clic aquí para verificar
                </span>
              )}
            </Button>
          </div>
        )}

        {/* Mensaje informativo para Core Wallet */}
        {!web3.isReady && !web3.isInitializing && (
          <div className="mt-3">
            <div className="p-4 bg-blue-900/10 border border-blue-500/30 text-blue-400 rounded-md">
              <h4 className="font-semibold mb-1">Información de diagnóstico</h4>
              <p className="text-sm mb-2">
                Si estás usando Core Wallet y ya la tienes conectada, pero el
                sistema no la detecta:
              </p>
              <ol className="text-sm list-decimal pl-5">
                <li>Asegúrate que Core Wallet está desbloqueada</li>
                <li>
                  Comprueba que estás en la red correcta (Sepolia, Polygon,
                  etc.)
                </li>
                <li>Intenta actualizar la página</li>
                <li>
                  Usa el botón "¿Ya conectaste tu wallet?" que aparece arriba
                </li>
                <li>
                  Si nada funciona, intenta desconectar y volver a conectar tu
                  wallet
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-dark-lighter rounded-lg p-6 border border-dark-lightest"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-4 pb-2 border-b border-dark-lightest">
              Información del Certificado
            </h3>

            <FormField
              label="Título del Certificado"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ej. Certificado de Finalización de Curso de Blockchain"
              required
            />

            <FormField
              label="Emisor"
              id="issuer"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              placeholder="ej. Academia Blockchain"
              required
            />

            <FormField
              label="Descripción"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              isTextArea={true}
              rows={4}
              placeholder="Describe el logro, curso o certificación..."
            />

            <FormField
              label="Habilidades (separadas por comas)"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="ej. Smart Contracts, Solidity, Web3.js"
            />

            <FormField
              label="Fecha de Expiración (opcional)"
              id="expirationDate"
              name="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 pb-2 border-b border-dark-lightest">
              Información del Destinatario
            </h3>

            <FormField
              label="Nombre Completo"
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              placeholder="ej. Juan Pérez"
              required
            />

            <FormField
              label="Correo Electrónico"
              id="recipientEmail"
              name="recipientEmail"
              type="email"
              value={formData.recipientEmail}
              onChange={handleChange}
              placeholder="nombre@ejemplo.com"
              required
            />

            <FormField
              label="Dirección de Wallet del Destinatario"
              id="recipientAddress"
              name="recipientAddress"
              value={formData.recipientAddress}
              onChange={handleChange}
              placeholder="0x..."
              required
            />

            <div className="mt-6">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b border-dark-lightest">
                Imagen del Certificado
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-light mb-1">
                  Subir Imagen (opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-light-darker bg-dark rounded border border-dark-lightest px-3 py-2"
                />
                <p className="mt-1 text-xs text-light-darker">
                  Formatos recomendados: PNG, JPEG. Tamaño máximo: 5MB
                </p>
              </div>

              {previewUrl && (
                <div className="mt-3 border border-dark-lightest rounded-md overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Vista previa del certificado"
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
          <Link href="/certificados">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            disabled={
              isSubmitting ||
              web3.isInitializing ||
              (!web3.isReady && !web3.isInitializing)
            }
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                Creando certificado...
              </div>
            ) : web3.isInitializing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                Verificando wallet...
              </div>
            ) : !web3.isReady ? (
              "Conectar wallet para crear"
            ) : (
              "Crear y Registrar Certificado"
            )}
          </Button>
        </div>

        {isError && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 text-red-500 rounded-md">
            {errorMessage ||
              "Ocurrió un error al crear el certificado. Por favor, intenta nuevamente."}
          </div>
        )}
      </form>
    </div>
  );
}
