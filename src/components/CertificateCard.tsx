"use client";
import Link from "next/link";
import Image from "next/image";

interface CertificateCardProps {
  id: string;
  title: string;
  issuer: string;
  recipient: string;
  date: string;
  imageSrc?: string;
}

export default function CertificateCard({
  id,
  title,
  issuer,
  recipient,
  date,
  imageSrc,
}: CertificateCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition duration-300">
      <div className="relative h-40 bg-gray-700">
        {imageSrc ? (
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-700">
            <svg
              className="w-16 h-16 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
        )}
      </div>
      <div className="bg-gradient-to-r from-blue-600/20 to-green-500/20 px-4 py-8 text-center">
        <h3 className="font-bold text-xl mb-1 text-white">{title}</h3>
        <p className="text-gray-300 text-sm">Otorgado a {recipient}</p>
      </div>
      <div className="p-4">
        <div className="mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Emisor</span>
            <span className="text-sm">{issuer}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Fecha</span>
            <span className="text-sm">{date}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/certificados/${id}`}
            className="text-blue-500 hover:text-blue-400 text-sm font-medium flex-1 text-center py-2 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"
          >
            Ver
          </Link>
          <Link
            href={`/verificar/${id}`}
            className="text-green-500 hover:text-green-400 text-sm font-medium flex-1 text-center py-2 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"
          >
            Verificar
          </Link>
        </div>
      </div>
    </div>
  );
}
