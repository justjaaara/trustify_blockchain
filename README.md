# Trustify Blockchain - Certificados Verificables en Avalanche

![Trustify Blockchain](https://via.placeholder.com/800x400?text=Trustify+Blockchain)

## 📌 Proyecto para Avalanche x Fusion Hackadev

> *Transformando la emisión y verificación de certificados a través de la tecnología blockchain de Avalanche*

## 📝 Descripción del Problema

En el mundo actual, la verificación de certificados y credenciales educativas o profesionales sigue siendo un proceso propenso a fraudes, ineficiente y centralizado. Las instituciones educativas, empresas y organizaciones enfrentan desafíos significativos:

- **Falsificación de credenciales**: Los certificados tradicionales son fácilmente falsificables
- **Procesos de verificación lentos**: Los empleadores deben contactar manualmente a las instituciones emisoras
- **Dependencia de terceros centralizados**: La validez de los certificados depende de autoridades centralizadas
- **Pérdida o deterioro de documentos físicos**: Los certificados en papel pueden perderse o dañarse

Trustify Blockchain resuelve estos problemas mediante una plataforma descentralizada para la creación, emisión y verificación de certificados digitales utilizando la tecnología blockchain de Avalanche, permitiendo una verificación inmediata, transparente y a prueba de manipulaciones.

## 🚀 Características Principales

- **Emisión de Certificados**: Crea y emite certificados digitales personalizables como NFTs (ERC-721)
- **Verificación en Blockchain**: Verifica la autenticidad de cualquier certificado mediante su ID o archivo
- **Panel de Certificados**: Administra todos tus certificados emitidos o recibidos
- **Conexión con Wallets**: Integración con carteras digitales para firmar transacciones en Avalanche
- **Sistema de Whitelist**: Control de acceso para emisores autorizados

## 🔍 Integración con el Ecosistema Avalanche

Trustify aprovecha el potencial de Avalanche de las siguientes maneras:

1. **Implementación en C-Chain**: Los smart contracts están desplegados en la Avalanche C-Chain (Fuji Testnet), aprovechando su compatibilidad con EVM y las bajas comisiones de gas
2. **Finality rápida**: Utilizamos la velocidad de finalidad de transacciones de Avalanche para ofrecer una verificación casi instantánea de certificados
3. **Escalabilidad**: La plataforma está diseñada para aprovechar el alto throughput de Avalanche
4. **Interoperabilidad**: La arquitectura permite futuras expansiones hacia el ecosistema más amplio de Avalanche y subnets específicas para casos de uso educativos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15**: Framework React con App Router para renderizado híbrido
- **React 19**: Biblioteca para construcción de interfaces de usuario
- **TypeScript**: Superset de JavaScript con tipado estático
- **Tailwind CSS 4**: Framework CSS para diseño responsive y personalizado
- **Geist Font**: Tipografía moderna y accesible

### Blockchain
- **Solidity**: Lenguaje para contratos inteligentes en Avalanche C-Chain (compatible con EVM)
- **OpenZeppelin**: Implementaciones seguras y estándar de contratos (ERC721)
- **Viem**: Biblioteca ligera para interactuar con Avalanche C-Chain
- **Avalanche Fuji**: Red de prueba para desplegar los contratos inteligentes

### Autenticación y Wallets
- **Privy**: Solución para autenticación y gestión de wallets integrada con Avalanche
- **Merkle Tree**: Estructura de datos para verificación eficiente de listas blancas

### Herramientas de Desarrollo
- **ESLint**: Linting para mantener código consistente
- **TypeScript**: Comprobación de tipos en tiempo de desarrollo
- **Turbopack**: Optimización del proceso de desarrollo

## 🔧 Arquitectura del Proyecto

### Smart Contracts
- **EducationalCertificates.sol**: Contrato principal NFT para certificados educativos (ERC721) con funcionalidades de emisión, verificación y revocación
- **CertificateVerifier.sol**: Verifica la validez de certificados en la blockchain de Avalanche
- **CertificateFactory.sol**: Factory pattern para desplegar nuevos contratos de certificados para diferentes instituciones

### Frontend
- **Componentes Reutilizables**: Button, FormField, CertificateCard, Navbar
- **Páginas Principales**:
  - Home (`/`): Página principal de la plataforma
  - Crear (`/crear`): Formulario para creación de certificados
  - Verificar (`/verificar`): Herramienta para verificación de certificados
  - Certificados (`/certificados`): Lista de certificados y gestión
  - Conectar Wallet (`/conectar-wallet`): Conexión de carteras digitales de Avalanche

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm, yarn o pnpm
- MetaMask u otra wallet compatible con Avalanche C-Chain
- AVAX de prueba para la red Fuji (disponibles en [Faucet de Avalanche](https://faucet.avax.network/))

## 🔌 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/trustify_blockchain.git
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

## 🧪 Despliegue de Smart Contracts en Avalanche Fuji

### Preparación

1. Accede a Remix IDE: [https://remix.ethereum.org/](https://remix.ethereum.org/)
2. Sube los contratos inteligentes ubicados en `src/contracts/`:
   - `EducationalCertificates.sol`
   - `CertificateVerifier.sol`
   - `CertificateFactory.sol`

### Compilación y Despliegue

1. **Compilación**:
   - En Remix IDE, selecciona el icono del compilador en la barra lateral
   - Elige la versión de Solidity `0.8.0` o superior
   - Compila cada contrato haciendo clic en "Compile"

2. **Configuración de Despliegue**:
   - Selecciona el icono "Deploy & Run Transactions" en la barra lateral
   - En el menú desplegable de Entorno, selecciona "Injected Provider - MetaMask" 
   - Asegúrate de que MetaMask esté configurado en la red Avalanche Fuji Testnet
   - Configuración de Avalanche Fuji en MetaMask:
     - Network Name: Avalanche Fuji Testnet
     - RPC URL: https://api.avax-test.network/ext/bc/C/rpc
     - Chain ID: 43113
     - Currency Symbol: AVAX
     - Block Explorer URL: https://testnet.snowtrace.io/

3. **Orden de Despliegue**:
   - Primero despliega `CertificateFactory.sol`
   - Luego interactúa con este contrato para crear instancias de `EducationalCertificates`
   - Finalmente despliega `CertificateVerifier.sol` para verificar certificados

4. **Verificación**:
   - Una vez desplegados, verifica los contratos en [Avalanche Fuji Explorer](https://testnet.snowtrace.io/)
   - Los certificados emitidos pueden verse como NFTs en cualquier explorador de NFTs compatible con Avalanche

## 📱 Guía de Usuario

### Conectar Wallet

1. Haz clic en el botón "Conectar Wallet" en la barra de navegación
2. Selecciona tu wallet (MetaMask, WalletConnect, etc.) configurada con Avalanche Network
3. Autoriza la conexión

### Crear un Certificado

1. Navega a la página "Crear"
2. Completa el formulario con:
   - Título del certificado
   - Emisor
   - Información del destinatario
   - Descripción y habilidades
   - Fecha de expiración (opcional)
   - Imagen del certificado (opcional)
3. Haz clic en "Crear y Registrar Certificado"
4. Confirma la transacción en tu wallet (requiere gas en AVAX)
5. Guarda el ID del certificado generado

### Verificar un Certificado

1. Navega a la página "Verificar"
2. Selecciona la verificación por ID o por archivo:
   - **Por ID**: Ingresa el ID único del certificado (formato: cert-XXX)
   - **Por Archivo**: Sube el archivo PDF o JSON del certificado
3. Haz clic en "Verificar Certificado"
4. La verificación se realiza consultando directamente a la blockchain de Avalanche
5. Visualiza los resultados de la verificación y los detalles del certificado

### Administrar Certificados

1. Navega a la página "Certificados"
2. Explora tus certificados emitidos o recibidos
3. Utiliza los filtros y la búsqueda para encontrar certificados específicos
4. Haz clic en un certificado para ver todos sus detalles

## 🔒 Seguridad e Innovación

- **Inmutabilidad**: Los certificados, una vez emitidos, son inmutables en la blockchain de Avalanche
- **Acceso Controlado**: Solo emisores autorizados pueden crear certificados (sistema de whitelist)
- **Certificados Temporales**: Los certificados pueden tener fechas de expiración parametrizables
- **Revocación**: Un certificado puede ser revocado por su emisor si es necesario
- **Sistema Anti-Sybil**: Implementación de Merkle Trees para prevenir ataques Sybil

## 📊 Arquitectura Blockchain

### Funcionamiento del Sistema de Verificación

1. Cada certificado se emite como un NFT (ERC-721) en Avalanche C-Chain
2. Los datos del certificado se almacenan en IPFS y la referencia en Avalanche
3. La verificación consulta al contrato inteligente para confirmar:
   - Existencia del certificado
   - Propietario correcto
   - No revocación
   - No expiración

### Proceso de Emisión

1. El emisor autorizado crea un certificado en la interfaz web
2. Los metadatos se suben a IPFS
3. El hash IPFS y los datos básicos se registran en la blockchain de Avalanche
4. Se emite un NFT representando el certificado al destinatario

## 💡 Impacto y Potencial de Mercado

Trustify Blockchain tiene el potencial de generar impacto en múltiples sectores:

- **Educación**: Instituciones educativas pueden emitir títulos y certificados verificables
- **Formación Profesional**: Cursos y certificaciones técnicas con validez inmediata
- **Recursos Humanos**: Verificación instantánea de credenciales profesionales
- **Eventos y Conferencias**: Certificaciones de asistencia y participación

El mercado global de credenciales digitales se estima en crecimiento exponencial, y Trustify ofrece una solución escalable que puede expandirse a diversos sectores mediante subnets específicas de Avalanche.

## 🔮 Visión de Futuro

Nuestros próximos pasos incluyen:

1. **Creación de Subnet Dedicada**: Una subnet específica para certificados educativos en Avalanche
2. **Interoperabilidad Cross-chain**: Permitir verificación en otras blockchains mediante bridges
3. **Implementación de Sistemas de Reputación**: Scoring basado en certificados verificados
4. **Marketplace de Certificados**: Plataforma para descubrir y adquirir cursos certificados

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -m 'Añade nueva característica'`)
4. Empuja la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo [Licencia MIT](LICENSE).

## 📞 Equipo y Contacto

**Equipo Trustify**:
- Josué (Desarrollador Full-Stack y Blockchain)
- [Añadir resto del equipo]

Para más información: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)
