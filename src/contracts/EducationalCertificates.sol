// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract EducationalCertificates is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Certificate {
        uint256 idTarget;
        uint256 issueDate;
        uint256 expirationDate;
        address institution;
        string ipfsHash;
        bool revoked;
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(address => bool) public authorizedInstitutions;
    
    event CertificateIssued(
        uint256 indexed tokenId, 
        address indexed student, 
        address institution, 
        string ipfsHash
    );
    event CertificateRevoked(
        uint256 indexed tokenId, 
        address indexed revoker
    );

    constructor() ERC721("EducationalCertificates", "EDUCERT") Ownable(msg.sender) {}

    modifier onlyAuthorized() {
        require(
            authorizedInstitutions[msg.sender] || msg.sender == owner(), 
            "Not authorized"
        );
        _;
    }

    // Modificamos el validador para usar el método ownerOf() en lugar de _exists
    modifier validToken(uint256 _tokenId) {
        // Si el token no existe, ownerOf() lanzará un error
        // Usamos un try/catch para capturar ese error y mostrar nuestro propio mensaje
        try this.ownerOf(_tokenId) returns (address) {
            // Si llegamos aquí, el token existe
            _;
        } catch {
            revert("Certificate does not exist");
        }
    }

    function addInstitution(address _institution) external onlyOwner {
        authorizedInstitutions[_institution] = true;
    }

    function removeInstitution(address _institution) external onlyOwner {
        authorizedInstitutions[_institution] = false;
    }

    function issueCertificate(
        address _student,
        string memory _ipfsHash,
        uint256 _idTarget,
        uint256 _expirationDate
    ) public onlyAuthorized returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(_student, newTokenId);
        
        certificates[newTokenId] = Certificate({
            idTarget: _idTarget,
            issueDate: block.timestamp,
            expirationDate: _expirationDate,
            institution: msg.sender,
            ipfsHash: _ipfsHash,
            revoked: false
        });
        
        emit CertificateIssued(newTokenId, _student, msg.sender, _ipfsHash);
        return newTokenId;
    }

    function revokeCertificate(uint256 _tokenId) external validToken(_tokenId) {
        require(
            msg.sender == ownerOf(_tokenId) || 
            msg.sender == certificates[_tokenId].institution ||
            msg.sender == owner(),
            "Not authorized"
        );
        certificates[_tokenId].revoked = true;
        emit CertificateRevoked(_tokenId, msg.sender);
    }

    function isValid(uint256 _tokenId) public view validToken(_tokenId) returns (bool) {
        Certificate memory cert = certificates[_tokenId];
        return 
            !cert.revoked &&
            (cert.expirationDate == 0 || block.timestamp <= cert.expirationDate);
    }

    function getCertificateDetails(uint256 _tokenId) 
        public 
        view 
        validToken(_tokenId)
        returns (
            uint256 issueDate,
            uint256 expirationDate,
            address institution,
            string memory ipfsHash,
            bool revoked
        ) 
    {
        Certificate storage cert = certificates[_tokenId];
        return (
            cert.issueDate,
            cert.expirationDate,
            cert.institution,
            cert.ipfsHash,
            cert.revoked
        );
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function tokenURI(uint256 _tokenId) 
        public 
        view 
        override 
        validToken(_tokenId) 
        returns (string memory) 
    {
        return string(
            abi.encodePacked(
                _baseURI(), 
                certificates[_tokenId].ipfsHash
            )
        );
    }

    // Error 2 corregido: issueCertificate ahora es public en lugar de external
    function batchIssueCertificates(
        address[] memory _students,
        string[] memory _ipfsHashes,
        uint256[] memory _expirationDates,
        uint256[] memory _idTarget
    ) external onlyAuthorized {
        require(
            _students.length == _ipfsHashes.length && 
            _students.length == _expirationDates.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < _students.length; i++) {
            issueCertificate(
                _students[i],
                _ipfsHashes[i],
                _idTarget[i],
                _expirationDates[i]
            );
        }
    }
}