import { ethers } from "ethers";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import EducationalCertificatesABI from "../contracts/abis/EducationalCertificates.json";

// Dirección del contrato deployado (deberás reemplazarla con la dirección real donde se deployó tu contrato)
const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS || "";

// Función para obtener una instancia del contrato
export const getCertificateContract = async (provider: any) => {
  try {
    console.log("Provider recibido:", provider);

    let signer;
    let ethersProvider;

    // Comprobar el tipo de proveedor y obtener el signer apropiadamente
    if (provider.provider?.request || provider.request) {
      // Provider compatible con EIP-1193 (Core Wallet y otros)
      console.log("Usando provider con EIP-1193");
      // Crear un proveedor de ethers basado en el provider EIP-1193
      const providerToUse = provider.provider?.request
        ? provider.provider
        : provider;
      ethersProvider = new ethers.BrowserProvider(providerToUse);
      try {
        signer = await ethersProvider.getSigner();
        console.log("Signer obtenido via ethersProvider");
      } catch (e) {
        console.error("Error al obtener signer via ethersProvider:", e);
        throw e;
      }
    } else if (provider.getSigner) {
      // Proveedor estándar de ethers (MetaMask, etc.)
      try {
        signer = await provider.getSigner();
        console.log("Signer obtenido via provider.getSigner()");
      } catch (e) {
        console.error("Error al obtener signer via getSigner():", e);
        throw e;
      }
    } else if (provider.getAddress) {
      // El proveedor ya es un signer (algunos wallets hacen esto)
      signer = provider;
      console.log("Provider ya es un signer");
    } else if (provider.provider && provider.provider.getSigner) {
      // Estructura anidada (algunos wallets como Core pueden usar esto)
      try {
        signer = await provider.provider.getSigner();
        console.log("Signer obtenido via provider.provider.getSigner()");
      } catch (e) {
        console.error(
          "Error al obtener signer via provider.provider.getSigner():",
          e
        );
        throw e;
      }
    } else {
      // Si llegamos aquí, el provider no tiene una estructura reconocida
      console.error("Estructura de provider no reconocida:", provider);
      throw new Error("Tipo de provider no soportado");
    }

    // Verificar que tenemos un signer válido
    if (!signer) {
      throw new Error("No se pudo obtener un signer válido");
    }

    // Obtener la dirección para verificar
    try {
      const address = await signer.getAddress();
      console.log("Signer address:", address);
    } catch (e) {
      console.warn("No se pudo obtener la dirección del signer:", e);
      // Continuar de todos modos ya que algunos signers podrían no implementar getAddress
    }

    return new ethers.Contract(
      CONTRACT_ADDRESS,
      EducationalCertificatesABI,
      signer
    );
  } catch (error) {
    console.error("Error detallado al obtener el contrato:", error);
    throw new Error(
      `No se pudo conectar con el contrato inteligente: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

// Función para publicar un certificado
export const issueCertificate = async (
  provider: any,
  studentAddress: string,
  ipfsHash: string,
  idTarget: number,
  expirationDate: number = 0
) => {
  try {
    console.log("Emitiendo certificado con provider:", provider);
    console.log("Datos del certificado:", {
      studentAddress,
      ipfsHash,
      idTarget,
      expirationDate,
    });

    const contract = await getCertificateContract(provider);
    console.log("Contrato obtenido correctamente");

    // Verificar que el contrato tiene la función issueCertificate
    if (!contract.issueCertificate) {
      throw new Error("El contrato no tiene la función issueCertificate");
    }

    console.log("Enviando transacción...");
    const tx = await contract.issueCertificate(
      studentAddress,
      ipfsHash,
      idTarget,
      expirationDate
    );
    console.log("Transacción enviada:", tx.hash);

    console.log("Esperando confirmación...");
    const receipt = await tx.wait();
    console.log("Transacción confirmada:", receipt);

    // Extraer el ID del certificado del evento emitido
    const event = receipt.logs.find((log: any) => {
      try {
        return (
          log.topics[0] ===
          ethers.id("CertificateIssued(uint256,address,address,string)")
        );
      } catch (e) {
        console.error("Error al procesar log:", e);
        return false;
      }
    });

    if (!event) {
      console.warn(
        "No se encontró el evento específico, buscando alternativas..."
      );
      // Intenta otro enfoque para extraer el ID (si el contrato tiene otra estructura de eventos)
      if (receipt.logs.length > 0) {
        try {
          // Asumimos que el primer log podría contener la información
          const firstLog = receipt.logs[0];
          console.log("Usando primer log como alternativa:", firstLog);

          // Si no podemos decodificar el evento, retornamos un ID basado en timestamp
          return {
            tokenId: BigInt(Date.now()),
            receipt,
          };
        } catch (e) {
          console.error("Error al procesar log alternativo:", e);
        }
      }
      throw new Error("No se pudo encontrar el evento de certificado emitido");
    }

    try {
      const decodedEvent = ethers.AbiCoder.defaultAbiCoder().decode(
        ["uint256", "address", "address", "string"],
        event.data
      );

      return {
        tokenId: decodedEvent[0],
        receipt,
      };
    } catch (e) {
      console.error("Error al decodificar el evento:", e);
      // Si falla la decodificación, intentamos usar el hash de la transacción como identificador
      return {
        tokenId: BigInt(parseInt(receipt.hash.slice(2, 10), 16)), // Usar parte del hash como ID numérico
        receipt,
      };
    }
  } catch (error) {
    console.error("Error detallado al emitir certificado:", error);
    throw new Error(
      `No se pudo emitir el certificado: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

// Función para verificar un certificado
export const verifyCertificate = async (provider: any, tokenId: number) => {
  try {
    const contract = await getCertificateContract(provider);
    const isValid = await contract.isValid(tokenId);

    if (!isValid) {
      return { valid: false, details: null };
    }

    const details = await contract.getCertificateDetails(tokenId);
    const owner = await contract.ownerOf(tokenId);

    return {
      valid: true,
      details: {
        tokenId,
        issueDate: new Date(Number(details.issueDate) * 1000).toISOString(),
        expirationDate:
          details.expirationDate > 0
            ? new Date(Number(details.expirationDate) * 1000).toISOString()
            : null,
        institution: details.institution,
        ipfsHash: details.ipfsHash,
        revoked: details.revoked,
        owner,
      },
    };
  } catch (error) {
    console.error("Error al verificar certificado:", error);
    return { valid: false, error: "El certificado no existe o no es válido" };
  }
};

// Función para revocar un certificado
export const revokeCertificate = async (provider: any, tokenId: number) => {
  try {
    const contract = await getCertificateContract(provider);
    const tx = await contract.revokeCertificate(tokenId);
    const receipt = await tx.wait();
    return { success: true, receipt };
  } catch (error) {
    console.error("Error al revocar certificado:", error);
    throw new Error("No se pudo revocar el certificado");
  }
};

// Hook personalizado para gestionar la conexión web3
export const useWeb3 = () => {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const [walletState, setWalletState] = useState({
    isReady: false,
    isInitializing: false,
    provider: null,
    address: "",
    error: "",
  });

  useEffect(() => {
    if (ready) {
      const checkWalletStatus = async () => {
        console.log("Verificando estado de la wallet...");
        console.log("Autenticado:", authenticated);

        if (!authenticated) {
          setWalletState({
            isReady: false,
            isInitializing: false,
            provider: null,
            address: "",
            error: "",
          });
          return;
        }

        if (authenticated && user) {
          setWalletState((prev) => ({ ...prev, isInitializing: true }));

          try {
            // Intentar obtener el proveedor de la wallet
            console.log("Usuario autenticado:", user);
            console.log("Wallets disponibles:", user.wallets);

            if (user.wallets && user.wallets.length > 0) {
              let provider = null;

              // Obtener la wallet conectada - incluye Core explícitamente
              const connectedWallet = user.wallets.find(
                (wallet) =>
                  wallet.walletClientType === "privy" ||
                  wallet.walletClientType === "metamask" ||
                  wallet.walletClientType === "walletconnect" ||
                  wallet.walletClientType === "coinbase_wallet" ||
                  wallet.walletClientType === "phantom" ||
                  wallet.walletClientType === "core" || // Añadimos Core explícitamente
                  wallet.connected === true // También detectamos cualquier wallet conectada
              );

              console.log("Wallet seleccionada:", connectedWallet);

              if (connectedWallet) {
                try {
                  console.log(
                    "Solicitando proveedor para",
                    connectedWallet.walletClientType
                  );
                  provider = await user.getEthereumProvider();
                  console.log("Proveedor obtenido:", provider);

                  // Obtener la dirección de la wallet
                  let address = "";
                  if (connectedWallet.address) {
                    address = connectedWallet.address;
                    console.log(
                      "Dirección obtenida del objeto wallet:",
                      address
                    );
                  } else if (provider && provider.request) {
                    try {
                      const accounts = await provider.request({
                        method: "eth_requestAccounts",
                      });
                      address = accounts[0];
                      console.log(
                        "Dirección obtenida mediante eth_requestAccounts:",
                        address
                      );
                    } catch (error) {
                      console.error(
                        "Error al obtener cuentas mediante eth_requestAccounts:",
                        error
                      );

                      // Intento alternativo con eth_accounts
                      try {
                        const accounts = await provider.request({
                          method: "eth_accounts",
                        });
                        if (accounts && accounts.length > 0) {
                          address = accounts[0];
                          console.log(
                            "Dirección obtenida mediante eth_accounts:",
                            address
                          );
                        }
                      } catch (secondError) {
                        console.error(
                          "Error al obtener cuentas mediante eth_accounts:",
                          secondError
                        );
                      }
                    }
                  }

                  if (!address && provider && provider.selectedAddress) {
                    address = provider.selectedAddress;
                    console.log(
                      "Dirección obtenida de selectedAddress:",
                      address
                    );
                  }

                  console.log("Dirección final obtenida:", address);

                  setWalletState({
                    isReady: !!address, // Solo marcamos como ready si tenemos una dirección
                    isInitializing: false,
                    provider,
                    address,
                    error: !address
                      ? "No se pudo obtener la dirección de la wallet"
                      : "",
                  });
                } catch (error) {
                  console.error("Error al obtener el proveedor:", error);
                  setWalletState({
                    isReady: false,
                    isInitializing: false,
                    provider: null,
                    address: "",
                    error: `Error al obtener el proveedor: ${
                      error instanceof Error
                        ? error.message
                        : "Error desconocido"
                    }`,
                  });
                }
              } else {
                // No hay wallet conectada que podamos utilizar
                console.log("No se encontró wallet conectada compatible");
                setWalletState({
                  isReady: false,
                  isInitializing: false,
                  provider: null,
                  address: "",
                  error: authenticated
                    ? "No se encontró una wallet compatible. Por favor, conecta Metamask, Core Wallet, WalletConnect o Coinbase Wallet"
                    : "Usuario no autenticado",
                });
              }
            } else {
              console.log("No hay wallets disponibles");
              setWalletState({
                isReady: false,
                isInitializing: false,
                provider: null,
                address: "",
                error: authenticated
                  ? "No se encontró una wallet conectada"
                  : "Usuario no autenticado",
              });
            }
          } catch (error) {
            console.error("Error al verificar el estado de la wallet:", error);
            setWalletState({
              isReady: false,
              isInitializing: false,
              provider: null,
              address: "",
              error:
                error instanceof Error
                  ? error.message
                  : "Error desconocido al inicializar la wallet",
            });
          }
        }
      };

      checkWalletStatus();
    }
  }, [ready, authenticated, user]);

  // Wrapper para las funciones que requieren wallet
  const ensureWalletConnected = async () => {
    if (!walletState.isReady) {
      if (!authenticated) {
        await login();
        throw new Error("Por favor, completa la conexión de la wallet");
      }
      throw new Error(
        "La wallet no está lista. Verifica que esté conectada correctamente"
      );
    }
    return walletState.provider;
  };

  return {
    // Estado de la wallet
    isReady: walletState.isReady,
    isInitializing: walletState.isInitializing,
    address: walletState.address,
    error: walletState.error,
    provider: walletState.provider,
    user,

    // Acciones de autenticación
    login,
    logout,

    // Funciones de contrato con verificación de wallet conectada
    issueCertificate: async (
      studentAddress: string,
      ipfsHash: string,
      idTarget: number,
      expirationDate: number = 0
    ) => {
      const provider = await ensureWalletConnected();
      return issueCertificate(
        provider,
        studentAddress,
        ipfsHash,
        idTarget,
        expirationDate
      );
    },

    verifyCertificate: async (tokenId: number) => {
      const provider = await ensureWalletConnected();
      return verifyCertificate(provider, tokenId);
    },

    revokeCertificate: async (tokenId: number) => {
      const provider = await ensureWalletConnected();
      return revokeCertificate(provider, tokenId);
    },
  };
};
