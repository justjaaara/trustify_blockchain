// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICertificate {
    function isValid(uint256 _tokenId) external view returns (bool);
    function getCertificateDetails(uint256 _tokenId) external view returns (
        uint256 issueDate,
        uint256 expirationDate,
        address institution,
        string memory ipfsHash,
        bool revoked
    );
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract CertificateVerifier {
    // Cambio de external a public para permitir llamadas internas
    function verifyCertificate(
        address _certificateContract,
        uint256 _tokenId,
        address _expectedOwner
    ) public view returns (bool, string memory) {
        try ICertificate(_certificateContract).ownerOf(_tokenId) returns (address owner) {
            if (owner != _expectedOwner) {
                return (false, "Owner mismatch");
            }
            
            (,,,, bool revoked) = ICertificate(_certificateContract).getCertificateDetails(_tokenId);
            
            if (revoked) {
                return (false, "Certificate revoked");
            }
            
            bool valid = ICertificate(_certificateContract).isValid(_tokenId);
            
            if (!valid) {
                return (false, "Certificate not valid");
            }
            
            return (true, "");
        } catch {
            return (false, "Invalid certificate contract");
        }
    }

    function batchVerify(
        address _certificateContract,
        uint256[] memory _tokenIds,
        address[] memory _expectedOwners
    ) external view returns (bool[] memory, string[] memory) {
        require(_tokenIds.length == _expectedOwners.length, "Array length mismatch");
        
        bool[] memory results = new bool[](_tokenIds.length);
        string[] memory messages = new string[](_tokenIds.length);
        
        for (uint i = 0; i < _tokenIds.length; i++) {
            (results[i], messages[i]) = verifyCertificate(
                _certificateContract,
                _tokenIds[i],
                _expectedOwners[i]
            );
        }
        
        return (results, messages);
    }
}