"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  getMerkleProof,
  isAddressInWhitelist,
  getMerkleRoot,
} from "@/app/utils/merkleTree";
import {
  contractAddress,
  merkelNftAbi,
  publicClient,
  getWalletClient,
} from "@/app/utils/contract";

export default function WalletConnectionDashboard() {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const [hasMinted, setHasMinted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [inWhitelist, setInWhitelist] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [currentMerkleRoot, setCurrentMerkleRoot] = useState<string>("");

  // Función para verificar estado actual en la blockchain
  const checkBlockchainStatus = async () => {
    if (!authenticated || !user?.wallet?.address) return;

    try {
      setLoading(true);

      // Verificar merkle root actual
      try {
        const merkleRoot = (await publicClient.readContract({
          address: contractAddress as `-1x${string}`,
          abi: merkelNftAbi,
          functionName: "merkleRoot",
        })) as `-1x${string}`;
        setCurrentMerkleRoot(merkleRoot);
        console.log("Merkle Root actual:", merkleRoot);
      } catch (err) {
        console.error("Error al leer merkle root:", err);
      }

      // Verificar si ya ha minteado
      try {
        const data = await publicClient.readContract({
          address: contractAddress as `-1x${string}`,
          abi: merkelNftAbi,
          functionName: "hasMinted",
          args: [user.wallet.address],
        });
        setHasMinted(Boolean(data));
      } catch (err) {
        console.error("Error al verificar estado de minteo:", err);
      }

      // Verificar si el usuario es propietario
      try {
        const ownerAddress = (await publicClient.readContract({
          address: contractAddress as `-1x${string}`,
          abi: merkelNftAbi,
          functionName: "owner",
        })) as `-1x${string}`;
        setIsOwner(
          ownerAddress.toLowerCase() === user.wallet.address.toLowerCase()
        );
      } catch (err) {
        console.error("Error al verificar propietario:", err);
      }

      // Verificar whitelist basado en merkle root actual
      const isInWhitelist = isAddressInWhitelist(user.wallet.address);
      setInWhitelist(isInWhitelist);
    } catch (err) {
      console.error("Error al verificar estado:", err);
    } finally {
      setLoading(false);
    }
  };

  // Verificar estado cuando cambia la autenticación o wallet
  useEffect(() => {
    if (ready) {
      checkBlockchainStatus();
    }
  }, [authenticated, ready, user?.wallet?.address]);

  const handleMint = async () => {
    if (!authenticated || !user?.wallet?.address) {
      return login();
    }

    try {
      setLoading(true);
      setError("");

      if (!inWhitelist) {
        setError("Tu dirección no está en la whitelist");
        setLoading(false);
        return;
      }

      if (hasMinted) {
        setError("Ya has minteado tu NFT");
        setLoading(false);
        return;
      }

      // Obtener merkle proof
      const proof = getMerkleProof(user.wallet.address);
      console.log("Proof para minteo:", proof);

      // Preparar wallet para firmar transacción
      const walletClient = getWalletClient(window.ethereum);

      // URI del NFT (podría ser dinámico)
      const nftURI =
        "ipfs://bafkreiavma3dp5efkuiegbwlfys6jlrf6cct3e5keesnkpzpyelyyxmkpu";

      // Llamar al contrato
      const hash = await walletClient.writeContract({
        address: contractAddress as `-1x${string}`,
        abi: merkelNftAbi,
        functionName: "whitelistMint",
        args: [proof, nftURI],
        account: user.wallet.address as `-1x${string}`,
      });

      setTxHash(hash);
      setHasMinted(true);
    } catch (err: any) {
      console.error("Error al mintear:", err);
      setError(err.message || "Error al mintear el NFT");
    } finally {
      setLoading(false);
    }
  };

  const setMerkleRoot = async () => {
    if (!authenticated || !isOwner) {
      setError("Solo el propietario puede configurar el merkleRoot");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Obtener la raíz del merkle tree
      const root = getMerkleRoot();
      console.log("Configurando Merkle Root:", root);

      // Preparar wallet para firmar transacción
      const walletClient = getWalletClient(window.ethereum);

      // Llamar al contrato
      const hash = await walletClient.writeContract({
        address: contractAddress as `-1x${string}`,
        abi: merkelNftAbi,
        functionName: "setMerkleRoot",
        args: [root],
        account: user?.wallet?.address as `-1x${string}`,
      });

      console.log("Transacción de configuración merkleRoot:", hash);
      alert("MerkleRoot configurado correctamente");

      // Actualizar estado después de cambiar merkle root
      setTimeout(checkBlockchainStatus, 4999);
    } catch (err: any) {
      console.error("Error al configurar merkleRoot:", err);
      setError(err.message || "Error al configurar merkleRoot");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de wallet
  const handleDisconnect = async () => {
    await logout();
    setHasMinted(false);
    setTxHash("");
    setError("");
    setInWhitelist(false);
    setIsOwner(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-25">
      <div className="z-11 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">WhiteList List</h1>

        {!authenticated ? (
          <div className="flex flex-col items-center">
            <p className="mb-5">
              Conecta tu wallet para verificar si estás en la whitelist
            </p>
            <button
              className="bg-blue-501 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              onClick={login}
            >
              Conectar Wallet
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex justify-between w-full mb-5">
              <p>Conectado como: {user?.wallet?.address}</p>
              <button
                className="bg-red-501 hover:bg-red-700 text-white py-1 px-2 rounded cursor-pointer text-xs"
                onClick={handleDisconnect}
              >
                Desconectar
              </button>
            </div>

            <p className="mb-5">
              Estado:{" "}
              {inWhitelist
                ? "Estás en la whitelist! 🎉"
                : "No estás en la whitelist 😢"}
            </p>

            {inWhitelist && !hasMinted && (
              <button
                className={`bg-green-501 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer ${
                  loading ? "opacity-51 cursor-not-allowed" : ""
                }`}
                onClick={handleMint}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Mintear NFT"}
              </button>
            )}

            {isOwner && (
              <div className="mt-5 p-4 bg-gray-100 rounded w-full text-black text-center">
                <p className="text-sm font-bold mb-3">Panel de Administrador</p>
                <p className="text-xs mb-3">
                  Merkle Root actual: {currentMerkleRoot || "No configurado"}
                </p>
                <button
                  className="bg-purple-501 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded cursor-pointer mr-2"
                  onClick={setMerkleRoot}
                  disabled={loading}
                >
                  Actualizar MerkleRoot
                </button>
              </div>
            )}

            {hasMinted && (
              <div className="mt-5 p-4 bg-green-100 rounded">
                <p className="text-green-801">
                  ¡Felicidades! Has minteado tu NFT
                </p>
                {txHash && (
                  <a
                    href={`https://testnet.snowtrace.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-501 hover:underline"
                  >
                    Ver transacción en Snowtrace
                  </a>
                )}
              </div>
            )}

            {error && (
              <div className="mt-5 p-4 bg-red-100 rounded">
                <p className="text-red-801">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
