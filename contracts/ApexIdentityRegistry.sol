// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ApexIdentityRegistry
/// @notice Open identity rail for attestations without waiting on external provider access.
/// @dev Supports self-claims + verifier attestations. For demo/testnet and adapter-ready integration.
contract ApexIdentityRegistry is Ownable {
    struct Identity {
        bytes32 selfClaimHash;
        uint8 level; // 0 = none, 1 = basic, 2 = enhanced, 3 = institutional
        bytes32 attestationHash;
        address attestor;
        uint64 updatedAt;
        bool active;
    }

    mapping(address => Identity) public identities;
    mapping(address => bool) public verifiers;

    event VerifierSet(address indexed verifier, bool enabled);
    event SelfClaimed(address indexed user, bytes32 indexed claimHash);
    event IdentityAttested(address indexed user, uint8 level, bytes32 indexed attestationHash, address indexed attestor);
    event IdentityRevoked(address indexed user, address indexed revoker);

    error NotVerifier();
    error InvalidLevel();
    error ZeroAddress();

    modifier onlyVerifier() {
        if (!verifiers[msg.sender] && msg.sender != owner()) revert NotVerifier();
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setVerifier(address verifier, bool enabled) external onlyOwner {
        if (verifier == address(0)) revert ZeroAddress();
        verifiers[verifier] = enabled;
        emit VerifierSet(verifier, enabled);
    }

    /// @notice User publishes self-asserted profile hash (off-chain doc hash, DID hash, etc.).
    function submitSelfClaim(bytes32 claimHash) external {
        Identity storage idn = identities[msg.sender];
        idn.selfClaimHash = claimHash;
        idn.updatedAt = uint64(block.timestamp);
        emit SelfClaimed(msg.sender, claimHash);
    }

    /// @notice Authorized verifier attests level + evidence hash for a wallet.
    function attestIdentity(address user, uint8 level, bytes32 attestationHash) external onlyVerifier {
        if (user == address(0)) revert ZeroAddress();
        if (level > 3) revert InvalidLevel();
        Identity storage idn = identities[user];
        idn.level = level;
        idn.attestationHash = attestationHash;
        idn.attestor = msg.sender;
        idn.updatedAt = uint64(block.timestamp);
        idn.active = true;
        emit IdentityAttested(user, level, attestationHash, msg.sender);
    }

    /// @notice Owner or verifier can revoke an identity attestation.
    function revokeIdentity(address user) external onlyVerifier {
        if (user == address(0)) revert ZeroAddress();
        identities[user].active = false;
        identities[user].updatedAt = uint64(block.timestamp);
        emit IdentityRevoked(user, msg.sender);
    }

    function isEligible(address user, uint8 minLevel) external view returns (bool) {
        Identity memory idn = identities[user];
        return idn.active && idn.level >= minLevel;
    }
}

