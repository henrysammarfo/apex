// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Authorized agent addresses and optional NexaID attestation hashes per wallet.
contract AgentRegistry is Ownable {
    mapping(address => bool) public authorizedAgents;
    mapping(address => bytes32) public nexaidHash;

    event AgentAuthorized(address indexed agent, bool authorized);
    event NexaIdVerified(address indexed wallet, bytes32 attestationHash);

    error ZeroAddress();

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setAgentAuthorization(address agent, bool authorized) external onlyOwner {
        if (agent == address(0)) revert ZeroAddress();
        authorizedAgents[agent] = authorized;
        emit AgentAuthorized(agent, authorized);
    }

    /// @dev Owner records NexaID attestation for a user wallet (ZKID / compliance demo).
    function verifyNexaId(address user, bytes32 attestationHash) external onlyOwner {
        if (user == address(0)) revert ZeroAddress();
        nexaidHash[user] = attestationHash;
        emit NexaIdVerified(user, attestationHash);
    }

    function isAuthorized(address agent) external view returns (bool) {
        return authorizedAgents[agent];
    }
}
