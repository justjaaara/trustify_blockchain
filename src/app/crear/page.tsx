"use client";

import { useState } from "react";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import Link from "next/link";

export default function CrearCertificadoPage() {
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    recipient: "",
    recipientEmail: "",
    description: "",
    expirationDate: "",
    skills: "",
  });

  const [certificateImage, setCertificateImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [newCertificateId, setNewCertificateId] = useState<string | null>(null);

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

    try {
      // Simulación de envío de datos
      // En un entorno real, aquí se conectaría con la API para crear el certificado
      // y registrarlo en blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulación de ID generado
      setNewCertificateId("cert-" + Math.floor(Math.random() * 1000));
      setIsSuccess(true);
    } catch (error) {
      console.error("Error al crear el certificado:", error);
      setIsError(true);
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
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                Creando certificado...
              </div>
            ) : (
              "Crear y Registrar Certificado"
            )}
          </Button>
        </div>

        {isError && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 text-red-500 rounded-md">
            Ocurrió un error al crear el certificado. Por favor, intenta
            nuevamente.
          </div>
        )}
      </form>
    </div>
  );
}
