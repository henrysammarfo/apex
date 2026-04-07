// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Testnet mock RWA with fixed supply: entire supply is minted once in the constructor.
/// @dev No post-deploy minting — total supply never increases. Demo liquidity comes from transfers (e.g. faucet pool).
contract MockRWA is ERC20 {
    uint256 public immutable maxSupply;

    constructor(string memory name_, string memory symbol_, uint256 maxSupply_, address initialHolder) ERC20(name_, symbol_) {
        require(initialHolder != address(0), "MockRWA: zero holder");
        require(maxSupply_ > 0, "MockRWA: zero supply");
        maxSupply = maxSupply_;
        _mint(initialHolder, maxSupply_);
    }
}
