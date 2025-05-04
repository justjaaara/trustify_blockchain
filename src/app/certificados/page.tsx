"use client";

import { useState } from "react";
import CertificateCard from "@/components/CertificateCard";

// Datos de ejemplo para mostrar en la interfaz
const certificadosEjemplo = [
  {
    id: "cert-001",
    title: "Certificado de Curso de Blockchain",
    issuer: "Academia Blockchain",
    recipient: "Ana García",
    date: "2025-03-15",
    imageSrc: "/certificate-1.jpg", // Estos archivos tendrían que crearse posteriormente
  },
  {
    id: "cert-002",
    title: "Diploma en Desarrollo Web",
    issuer: "Tech Institute",
    recipient: "Carlos Rodríguez",
    date: "2025-02-22",
    imageSrc: "/certificate-2.jpg",
  },
  {
    id: "cert-003",
    title: "Certificado de Finalización de Bootcamp",
    issuer: "Coding Academy",
    recipient: "María López",
    date: "2025-04-01",
  },
  {
    id: "cert-004",
    title: "Especialización en Inteligencia Artificial",
    issuer: "AI Research Institute",
    recipient: "Roberto Fernández",
    date: "2025-01-10",
  },
  {
    id: "cert-005",
    title: "Curso Avanzado de Ciberseguridad",
    issuer: "Security Labs",
    recipient: "Elena Torres",
    date: "2025-03-28",
  },
];

export default function CertificadosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");

  const filteredCertificados = certificadosEjemplo.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.recipient.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "todos") return matchesSearch;
    // Aquí se podrían añadir más filtros según categorías, estado, etc.

    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Certificados</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar certificados..."
              className="w-full rounded pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <select
            className="rounded px-4 py-2 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="emitidos">Emitidos</option>
            <option value="recibidos">Recibidos</option>
          </select>
        </div>
      </div>

      {filteredCertificados.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <p className="mt-4 text-xl font-semibold">
            No se encontraron certificados
          </p>
          <p className="mt-2 text-gray-300">
            Prueba con otra búsqueda o crea un nuevo certificado
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificados.map((certificado) => (
            <CertificateCard
              key={certificado.id}
              id={certificado.id}
              title={certificado.title}
              issuer={certificado.issuer}
              recipient={certificado.recipient}
              date={certificado.date}
              imageSrc={certificado.imageSrc}
            />
          ))}
        </div>
      )}
    </div>
  );
}
