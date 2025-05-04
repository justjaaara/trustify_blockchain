import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
          Certificados Verificables con Blockchain
        </h1>
        <p className="text-xl mb-8 text-gray-300 max-w-3xl">
          Plataforma segura para crear, emitir y verificar certificados
          digitales utilizando la tecnología blockchain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/crear">
            <Button variant="primary" size="lg">
              Crear Certificado
            </Button>
          </Link>
          <Link href="/verificar">
            <Button variant="secondary" size="lg">
              Verificar Certificado
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">100% Verificable</h3>
          <p className="text-gray-300">
            Cada certificado emitido puede ser verificado en blockchain,
            garantizando su autenticidad.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Rápido y Sencillo</h3>
          <p className="text-gray-300">
            Proceso intuitivo para crear y emitir certificados en minutos, sin
            conocimientos técnicos.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Inmutable y Seguro</h3>
          <p className="text-gray-300">
            Tecnología blockchain que garantiza la inmutabilidad y seguridad de
            todos los certificados.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">¿Cómo Funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 border border-blue-500 text-blue-500 flex items-center justify-center text-xl font-bold mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">Crea</h3>
            <p className="text-gray-300">
              Diseña tu certificado con toda la información necesaria.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 border border-blue-500 text-blue-500 flex items-center justify-center text-xl font-bold mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">Emite</h3>
            <p className="text-gray-300">
              Registra el certificado en la blockchain para hacerlo verificable.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 border border-blue-500 text-blue-500 flex items-center justify-center text-xl font-bold mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">Comparte</h3>
            <p className="text-gray-300">
              Envía el certificado digital al destinatario.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 border border-blue-500 text-blue-500 flex items-center justify-center text-xl font-bold mb-4">
              4
            </div>
            <h3 className="text-lg font-semibold mb-2">Verifica</h3>
            <p className="text-gray-300">
              Cualquiera puede verificar la autenticidad del certificado.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-800 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Comienza a usar Trustify hoy
        </h2>
        <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
          Empieza a crear certificados verificables y seguros en minutos.
        </p>
        <div className="flex justify-center">
          <Link href="/crear">
            <Button variant="primary" size="lg">
              Crear mi primer certificado
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
