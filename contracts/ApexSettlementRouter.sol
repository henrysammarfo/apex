// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title ApexSettlementRouter
/// @notice Open settlement rail with provider abstraction (APEX-native now, HSP adapter later).
contract ApexSettlementRouter is Ownable {
    using SafeERC20 for IERC20;

    enum Provider {
        APEX,
        HSP
    }

    enum Status {
        Pending,
        Completed,
        Failed,
        Cancelled
    }

    struct Settlement {
        uint256 id;
        address requester;
        address recipient;
        address token;
        uint256 amount;
        Provider provider;
        Status status;
        bytes32 requestRef; // hash of off-chain payload / idempotency key
        bytes32 receiptRef; // hash of receipt / provider confirmation
        uint64 createdAt;
        uint64 updatedAt;
    }

    uint256 public nextSettlementId = 1;
    mapping(uint256 => Settlement) public settlements;
    mapping(address => bool) public operators;

    event OperatorSet(address indexed operator, bool enabled);
    event SettlementRequested(
        uint256 indexed id,
        address indexed requester,
        address indexed recipient,
        address token,
        uint256 amount,
        Provider provider,
        bytes32 requestRef
    );
    event SettlementCompleted(uint256 indexed id, bytes32 indexed receiptRef, address indexed operator);
    event SettlementFailed(uint256 indexed id, bytes32 indexed receiptRef, address indexed operator);
    event SettlementCancelled(uint256 indexed id, address indexed operator);

    error NotOperator();
    error InvalidState();
    error ZeroAddress();
    error InvalidAmount();

    modifier onlyOperator() {
        if (!operators[msg.sender] && msg.sender != owner()) revert NotOperator();
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setOperator(address operator, bool enabled) external onlyOwner {
        if (operator == address(0)) revert ZeroAddress();
        operators[operator] = enabled;
        emit OperatorSet(operator, enabled);
    }

    /// @notice Request settlement by escrow transfer into router (open alternative rail).
    function requestSettlement(
        address recipient,
        address token,
        uint256 amount,
        Provider provider,
        bytes32 requestRef
    ) external returns (uint256 id) {
        if (recipient == address(0) || token == address(0)) revert ZeroAddress();
        if (amount == 0) revert InvalidAmount();

        id = nextSettlementId++;
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        settlements[id] = Settlement({
            id: id,
            requester: msg.sender,
            recipient: recipient,
            token: token,
            amount: amount,
            provider: provider,
            status: Status.Pending,
            requestRef: requestRef,
            receiptRef: bytes32(0),
            createdAt: uint64(block.timestamp),
            updatedAt: uint64(block.timestamp)
        });

        emit SettlementRequested(id, msg.sender, recipient, token, amount, provider, requestRef);
    }

    /// @notice Complete payout (APEX-native transfer now, HSP completion hash later).
    function completeSettlement(uint256 id, bytes32 receiptRef) external onlyOperator {
        Settlement storage s = settlements[id];
        if (s.id == 0 || s.status != Status.Pending) revert InvalidState();
        s.status = Status.Completed;
        s.receiptRef = receiptRef;
        s.updatedAt = uint64(block.timestamp);
        IERC20(s.token).safeTransfer(s.recipient, s.amount);
        emit SettlementCompleted(id, receiptRef, msg.sender);
    }

    function failSettlement(uint256 id, bytes32 receiptRef) external onlyOperator {
        Settlement storage s = settlements[id];
        if (s.id == 0 || s.status != Status.Pending) revert InvalidState();
        s.status = Status.Failed;
        s.receiptRef = receiptRef;
        s.updatedAt = uint64(block.timestamp);
        // Return escrow to requester on fail
        IERC20(s.token).safeTransfer(s.requester, s.amount);
        emit SettlementFailed(id, receiptRef, msg.sender);
    }

    function cancelSettlement(uint256 id) external onlyOperator {
        Settlement storage s = settlements[id];
        if (s.id == 0 || s.status != Status.Pending) revert InvalidState();
        s.status = Status.Cancelled;
        s.updatedAt = uint64(block.timestamp);
        IERC20(s.token).safeTransfer(s.requester, s.amount);
        emit SettlementCancelled(id, msg.sender);
    }
}

