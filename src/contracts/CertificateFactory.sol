// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EducationalCertificates.sol";

contract CertificateFactory {
    address[] public deployedCertificates;
    address public admin;
    
    event NewCertificateContract(address indexed contractAddress, address indexed creator);

    constructor() {
        admin = msg.sender;
    }

    function createCertificateContract() external returns (address) {
        EducationalCertificates newCert = new EducationalCertificates();
        newCert.transferOwnership(msg.sender);
        deployedCertificates.push(address(newCert));
        emit NewCertificateContract(address(newCert), msg.sender);
        return address(newCert);
    }

    function getDeployedCertificates() external view returns (address[] memory) {
        return deployedCertificates;
    }
}