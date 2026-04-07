// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title PortfolioVault
/// @notice Holds mock RWA tokens; agent adjusts balances via owner-funded rebalance moves (no on-chain DEX).
contract PortfolioVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public agent;

    struct AssetConfig {
        /// @dev Target weight in basis points (10000 = 100%).
        uint256 targetPctBps;
        /// @dev Drift trigger in basis points (e.g. 500 = 5%).
        uint256 driftThresholdBps;
        bool active;
    }

    mapping(address => AssetConfig) public assetConfigs;
    mapping(address => bool) public isTrackedAsset;
    address[] internal _assets;

    struct WithdrawalRecord {
        address recipient;
        uint256 amount;
        address token;
        bytes32 hspRef;
        uint256 timestamp;
    }
    WithdrawalRecord[] internal _withdrawals;

    event RebalanceExecuted(address indexed token, bool isIncrease, uint256 amount, uint256 timestamp);
    event YieldWithdrawn(address indexed recipient, address indexed token, uint256 amount, bytes32 indexed hspRef);
    event AgentUpdated(address indexed newAgent);
    event Deposited(address indexed token, uint256 amount);
    event AssetAdded(address indexed token, uint256 targetPctBps, uint256 driftThresholdBps);

    error NotAgent();
    error UnknownAsset();
    error InactiveAsset();
    error ZeroAddress();

    modifier onlyAgent() {
        if (msg.sender != agent) revert NotAgent();
        _;
    }

    constructor(address initialOwner, address initialAgent) Ownable(initialOwner) {
        if (initialAgent == address(0)) revert ZeroAddress();
        agent = initialAgent;
    }

    function assetsLength() external view returns (uint256) {
        return _assets.length;
    }

    function assetAt(uint256 index) external view returns (address) {
        return _assets[index];
    }

    function withdrawalsLength() external view returns (uint256) {
        return _withdrawals.length;
    }

    function getWithdrawal(uint256 index) external view returns (WithdrawalRecord memory) {
        return _withdrawals[index];
    }

    function setAgent(address newAgent) external onlyOwner {
        if (newAgent == address(0)) revert ZeroAddress();
        agent = newAgent;
        emit AgentUpdated(newAgent);
    }

    function addAsset(address token, AssetConfig calldata cfg) external onlyOwner {
        if (token == address(0)) revert ZeroAddress();
        if (!isTrackedAsset[token]) {
            isTrackedAsset[token] = true;
            _assets.push(token);
        }
        assetConfigs[token] = cfg;
        emit AssetAdded(token, cfg.targetPctBps, cfg.driftThresholdBps);
    }

    /// @notice Owner deposits ERC20 into the vault.
    function deposit(address token, uint256 amount) external nonReentrant onlyOwner {
        if (!isTrackedAsset[token]) revert UnknownAsset();
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(token, amount);
    }

    /// @notice Agent moves tokens between vault and owner to reflect a rebalance (owner must have approved tokens when increasing vault).
    function executeRebalance(address token, bool isIncrease, uint256 amount) external nonReentrant onlyAgent {
        if (!isTrackedAsset[token]) revert UnknownAsset();
        if (!assetConfigs[token].active) revert InactiveAsset();
        if (isIncrease) {
            IERC20(token).safeTransferFrom(owner(), address(this), amount);
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
        emit RebalanceExecuted(token, isIncrease, amount, block.timestamp);
    }

    /// @notice Owner withdraws yield; optional HSP reference for settlement audit trail.
    function withdrawYield(address token, address recipient, uint256 amount, bytes32 hspRef) external nonReentrant onlyOwner {
        if (recipient == address(0)) revert ZeroAddress();
        IERC20(token).safeTransfer(recipient, amount);
        _withdrawals.push(
            WithdrawalRecord({ recipient: recipient, amount: amount, token: token, hspRef: hspRef, timestamp: block.timestamp })
        );
        emit YieldWithdrawn(recipient, token, amount, hspRef);
    }

    /// @notice Current weights by raw balance (assumes comparable decimals / demo notionals).
    function getCurrentAllocations() external view returns (address[] memory tokens, uint256[] memory pctBps) {
        uint256 n = _assets.length;
        tokens = new address[](n);
        pctBps = new uint256[](n);
        uint256 total;
        for (uint256 i = 0; i < n; i++) {
            address t = _assets[i];
            tokens[i] = t;
            total += IERC20(t).balanceOf(address(this));
        }
        if (total == 0) return (tokens, pctBps);
        for (uint256 i = 0; i < n; i++) {
            address t = _assets[i];
            pctBps[i] = (IERC20(t).balanceOf(address(this)) * 10_000) / total;
        }
    }
}
