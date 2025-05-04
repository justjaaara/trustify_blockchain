"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import Image from 'next/image';

export default function VerificarCertificadoPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'verifying' | 'verified' | 'error'>('verifying');
  const [certificateData, setCertificateData] = useState<any>(null);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        // En un entorno real, aquí se verificaría el certificado en la blockchain
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Para propósitos de demostración, simulamos verificación exitosa si el ID sigue el formato
        if (params.id.startsWith('cert-')) {
          setCertificateData({
            id: params.id,
            title: "Certificado de Curso de Blockchain",
            issuer: "Academia Blockchain",
            issuer_id: "0x1234...5678",
            recipient: "Ana García",
            recipient_id: "0x8765...4321",
            date: "2025-03-15",
            expirationDate: "2030-03-15",
            description: "Este certificado verifica la finalización exitosa del curso avanzado de desarrollo blockchain.",
            skills: ["Smart Contracts", "Solidity", "DApps", "Web3.js"],
            transactionHash: "0xabcd...ef12",
            blockNumber: 12345678,
            timestamp: "2025-03-15T14:30:00Z",
          });
          setStatus('verified');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error("Error verificando el certificado:", error);
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    verifyCertificate();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-200">Verificando certificado en blockchain...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-red-500">Certificado No Verificado</h1>
          <p className="mb-6 text-gray-400">
            El certificado con ID <span className="font-mono font-semibold">{params.id}</span> no está registrado en la blockchain o no es válido.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/verificar">
              <Button variant="primary">Verificar otro certificado</Button>
            </Link>
            <Link href="/crear">
              <Button variant="secondary">Crear un certificado</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Verificación de Certificado</h1>
        <div className="flex items-center bg-green-900/20 text-green-500 px-4 py-2 rounded-full">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="font-medium">Verificado en Blockchain</span>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {/* Banner del certificado */}
        <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 px-6 py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{certificateData.title}</h2>
          <p className="text-gray-400">Otorgado a</p>
          <p className="text-xl font-semibold mb-4">{certificateData.recipient}</p>
          <div className="inline-block bg-gray-900 px-6 py-3 rounded-lg">
            <p className="text-sm text-gray-400">ID del Certificado</p>
            <p className="font-mono">{certificateData.id}</p>
          </div>
        </div>
        
        {/* Contenido del certificado */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">Detalles del Certificado</h3>
              <div className="space-y-3">
                <div>
                  <span className="block text-xs text-gray-400">Emisor</span>
                  <span>{certificateData.issuer}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400">ID del Emisor</span>
                  <span className="font-mono text-sm">{certificateData.issuer_id}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400">Fecha de Emisión</span>
                  <span>{certificateData.date}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400">Fecha de Expiración</span>
                  <span>{certificateData.expirationDate}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400">Descripción</span>
                  <p className="text-gray-300">{certificateData.description}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">Habilidades Certificadas</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {certificateData.skills.map((skill: string, index: number) => (
                  <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">Registro Blockchain</h3>
              <div className="space-y-3">
                <div>
                  <span className="block text-xs text-gray-400">Hash de Transacción</span>
                  <span className="font-mono text-sm break-all">{certificateData.transactionHash}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400">Número de Bloque</span>
                  <span className="font-mono">{certificateData.blockNumber}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400">Timestamp</span>
                  <span className="font-mono text-sm">{certificateData.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row gap-3">
            <Button variant="primary">Descargar Certificado</Button>
            <Link href="/certificados">
              <Button variant="outline">Ver todos los certificados</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
