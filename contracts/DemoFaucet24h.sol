// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Sends a fixed drip of an existing ERC20 from this contract's balance every 24h per address.
/// @dev Does not mint — total token supply is unchanged. Owner (or anyone) tops up by transferring tokens here.
contract DemoFaucet24h is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    uint256 public immutable claimAmount;
    uint256 public constant COOLDOWN = 24 hours;

    mapping(address => uint256) public lastClaimAt;

    error CooldownActive(uint256 nextClaimAt);
    error InsufficientBalance();

    event Claimed(address indexed claimant, uint256 amount);

    constructor(IERC20 token_, uint256 claimAmount_, address initialOwner) Ownable(initialOwner) {
        require(address(token_) != address(0), "DemoFaucet24h: zero token");
        require(claimAmount_ > 0, "DemoFaucet24h: zero claim");
        token = token_;
        claimAmount = claimAmount_;
    }

    /// @notice Transfer `claimAmount` from faucet balance to msg.sender if 24h elapsed since last claim.
    function claim() external {
        uint256 last = lastClaimAt[msg.sender];
        if (last != 0 && block.timestamp < last + COOLDOWN) {
            revert CooldownActive(last + COOLDOWN);
        }
        if (token.balanceOf(address(this)) < claimAmount) {
            revert InsufficientBalance();
        }
        lastClaimAt[msg.sender] = block.timestamp;
        token.safeTransfer(msg.sender, claimAmount);
        emit Claimed(msg.sender, claimAmount);
    }

    /// @notice Owner can recover tokens (e.g. migrate demo) without affecting global supply.
    function withdraw(address to, uint256 amount) external onlyOwner {
        token.safeTransfer(to, amount);
    }
}
