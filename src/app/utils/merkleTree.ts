import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

// Lista de direcciones que pueden mintear (incluye la tuya aquí)
const whitelistedAddresses = [
  "0x68905da737e5a11E3A93AB6CeC2eA8b145fce961",
  "0xd53aD32aE97Ce7E5636D65C9db8517c1CBcE7a2D",
  "0x48F369372100Eabda0969F1b2C8cD99325B83D33",
  "0x5B023AaaBcBAE32114F2fc7FAeCF77f598Da97b4",
  "0x6f7D2051944b7653cCE7fE21D11b230D9b46cC58",
  "0x5C325b559267E30f5A6e237f8e67eC3174A82B85",
  "0x6E673440e622C6aB9Ad7f5b5f41FCc08F3E0502D",
  "0x04B7c6C7e39FebEB5e0Ef9706c2E293610b71438",
  "0xBfC2b53C81C01B85256d959a422653cB49659899",
  // Asegúrate de incluir tu dirección en esta lista
];

// Crear nodos hoja y árbol
const leafNodes = whitelistedAddresses.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

export function getMerkleRoot() {
  return merkleTree.getHexRoot();
}

export function getMerkleProof(address: string) {
  if (!whitelistedAddresses.includes(address)) {
    console.error("¡Dirección no está en la whitelist!", address);
    return [];
  }

  const leaf = keccak256(address);
  const proof = merkleTree.getHexProof(leaf);

  return proof;
}

export function isAddressInWhitelist(address: string) {
  return whitelistedAddresses.includes(address);
}
