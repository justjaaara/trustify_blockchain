# Trustify Blockchain - Plataforma de Certificados Verificables

![Trustify Blockchain](https://via.placeholder.com/800x400?text=Trustify+Blockchain)

## 📝 Descripción

Trustify Blockchain es una plataforma descentralizada para la creación, emisión y verificación de certificados digitales utilizando la tecnología blockchain. Esta solución permite a instituciones educativas, empresas y organizaciones emitir certificados digitales que son inmutables, transparentes y verificables por cualquier persona a través de la cadena de bloques.

## 🚀 Características Principales

- **Emisión de Certificados**: Crea y emite certificados digitales personalizables.
- **Verificación en Blockchain**: Verifica la autenticidad de cualquier certificado mediante su ID o archivo.
- **Panel de Certificados**: Administra todos tus certificados emitidos o recibidos.
- **Conexión con Wallets**: Integración con carteras digitales para firmar transacciones.
- **Sistema de Whitelist**: Control de acceso para emisores autorizados.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15**: Framework React con App Router para renderizado híbrido.
- **React 19**: Biblioteca para construcción de interfaces de usuario.
- **TypeScript**: Superset de JavaScript con tipado estático.
- **Tailwind CSS 4**: Framework CSS para diseño responsive y personalizado.
- **Geist Font**: Tipografía moderna y accesible.

### Blockchain
- **Solidity**: Lenguaje para contratos inteligentes en Ethereum/EVM.
- **OpenZeppelin**: Implementaciones seguras y estándar de contratos (ERC721).
- **Viem**: Biblioteca ligera para interactuar con Ethereum.
- **Avalanche Fuji**: Red de prueba para desplegar los contratos inteligentes.

### Autenticación y Wallets
- **Privy**: Solución para autenticación y gestión de wallets.
- **Merkle Tree**: Estructura de datos para verificación eficiente.

### Herramientas de Desarrollo
- **ESLint**: Linting para mantener código consistente.
- **TypeScript**: Comprobación de tipos en tiempo de desarrollo.
- **TurboRepo**: Optimización del proceso de desarrollo.

## 🔧 Arquitectura del Proyecto

### Smart Contracts
- **EducationalCertificates.sol**: Contrato principal NFT para certificados educativos (ERC721).
- **CertificateVerifier.sol**: Verifica la validez de certificados en la blockchain.
- **CertificateFactory.sol**: Factory pattern para desplegar nuevos contratos de certificados.

### Frontend
- **Componentes Reutilizables**: Button, FormField, CertificateCard, Navbar.
- **Páginas Principales**:
  - Home (`/`): Página principal de la plataforma.
  - Crear (`/crear`): Formulario para creación de certificados.
  - Verificar (`/verificar`): Herramienta para verificación de certificados.
  - Certificados (`/certificados`): Lista de certificados y gestión.
  - Conectar Wallet (`/conectar-wallet`): Conexión de carteras digitales.

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm, yarn o pnpm
- MetaMask u otra wallet compatible con Avalanche Fuji
- AVAX de prueba para la red Fuji

## 🔌 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://tu-repositorio/trustify_blockchain.git
cd trustify_blockchain
```

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```
NEXT_PUBLIC_PRIVY_APP_ID=tu-app-id-de-privy
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5C325b559267E30f5A6e237f8e67eC3174A82B85
NEXT_PUBLIC_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
```

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 🧪 Despliegue de Smart Contracts

### Preparación

1. Instala Hardhat (si no está incluido en las dependencias):
```bash
npm install --save-dev hardhat
```

2. Configura tu wallet para el despliegue en el archivo `.env.local`:
```
PRIVATE_KEY=tu-clave-privada
```

### Compilación y Despliegue

```bash
# Compilar contratos
npx hardhat compile

# Desplegar en Avalanche Fuji
npx hardhat run scripts/deploy.js --network fuji
```

## 📱 Guía de Usuario

### Conectar Wallet

1. Haz clic en el botón "Conectar Wallet" en la barra de navegación.
2. Selecciona tu wallet (MetaMask, WalletConnect, etc.).
3. Autoriza la conexión.

### Crear un Certificado

1. Navega a la página "Crear".
2. Completa el formulario con:
   - Título del certificado
   - Emisor
   - Información del destinatario
   - Descripción y habilidades
   - Fecha de expiración (opcional)
   - Imagen del certificado (opcional)
3. Haz clic en "Crear y Registrar Certificado".
4. Confirma la transacción en tu wallet.
5. Guarda el ID del certificado generado.

### Verificar un Certificado

1. Navega a la página "Verificar".
2. Selecciona la verificación por ID o por archivo:
   - **Por ID**: Ingresa el ID único del certificado (formato: cert-XXX)
   - **Por Archivo**: Sube el archivo PDF o JSON del certificado
3. Haz clic en "Verificar Certificado".
4. Visualiza los resultados de la verificación y los detalles del certificado.

### Administrar Certificados

1. Navega a la página "Certificados".
2. Explora tus certificados emitidos o recibidos.
3. Utiliza los filtros y la búsqueda para encontrar certificados específicos.
4. Haz clic en un certificado para ver todos sus detalles.

## 🔒 Seguridad

- Los certificados una vez emitidos son inmutables en la blockchain.
- Solo emisores autorizados pueden crear certificados (whitelist).
- Los certificados pueden tener fechas de expiración.
- Un certificado puede ser revocado por su emisor si es necesario.

## 📊 Arquitectura Blockchain

### Funcionamiento del Sistema de Verificación

1. Cada certificado se emite como un NFT (ERC-721) en la blockchain.
2. Los datos del certificado se almacenan en IPFS y la referencia en el blockchain.
3. La verificación consulta al contrato inteligente para confirmar:
   - Existencia del certificado
   - Propietario correcto
   - No revocación
   - No expiración

### Proceso de Emisión

1. El emisor autorizado crea un certificado en la interfaz web.
2. Los metadatos se suben a IPFS.
3. El hash IPFS y los datos básicos se registran en el blockchain.
4. Se emite un NFT representando el certificado al destinatario.

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -m 'Añade nueva característica'`)
4. Empuja la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo [Licencia MIT](LICENSE).

## 📧 Contacto

Para más información, contacta con: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)
