// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Immutable-style append-only log of agent decisions; full reasoning kept off-chain (hash on-chain).
contract DecisionLog is Ownable {
    address public agent;

    struct Decision {
        bytes32 portfolioId;
        address asset;
        string decisionType;
        bool isIncrease;
        uint256 amount;
        uint8 confidence;
        bytes32 reasoningHash;
        uint256 timestamp;
    }

    Decision[] private _decisions;

    event AgentUpdated(address indexed newAgent);
    event DecisionLogged(uint256 indexed index, bytes32 indexed portfolioId, address indexed asset, bytes32 reasoningHash);

    error NotAgent();
    error ZeroAddress();

    modifier onlyAgent() {
        if (msg.sender != agent) revert NotAgent();
        _;
    }

    constructor(address initialOwner, address initialAgent) Ownable(initialOwner) {
        if (initialAgent == address(0)) revert ZeroAddress();
        agent = initialAgent;
    }

    function setAgent(address newAgent) external onlyOwner {
        if (newAgent == address(0)) revert ZeroAddress();
        agent = newAgent;
        emit AgentUpdated(newAgent);
    }

    function logDecision(
        bytes32 portfolioId,
        address asset,
        string calldata decisionType,
        bool isIncrease,
        uint256 amount,
        uint8 confidence,
        bytes32 reasoningHash
    ) external onlyAgent {
        _decisions.push(
            Decision({
                portfolioId: portfolioId,
                asset: asset,
                decisionType: decisionType,
                isIncrease: isIncrease,
                amount: amount,
                confidence: confidence,
                reasoningHash: reasoningHash,
                timestamp: block.timestamp
            })
        );
        uint256 idx = _decisions.length - 1;
        emit DecisionLogged(idx, portfolioId, asset, reasoningHash);
    }

    function getDecisionCount() external view returns (uint256) {
        return _decisions.length;
    }

    function getDecision(uint256 index) external view returns (Decision memory) {
        return _decisions[index];
    }
}
