// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyToken is ERC20 {
    address public owner;
    uint256 public tokenPriceInWei = 0.001 ether; // 1 token = 0.001 ETH

    constructor() ERC20("OOKO", "OK") {
        owner = msg.sender;
        _mint(owner, 1_000_000 * 10 ** decimals());
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /// @notice Allows users to buy tokens by sending ETH
    function buyTokens() external payable {
        require(msg.value > 0, "Send ETH to buy tokens");

        uint256 amountToBuy = (msg.value * 10 ** decimals()) / tokenPriceInWei;
        require(balanceOf(owner) >= amountToBuy, "Not enough tokens in reserve");

        _transfer(owner, msg.sender, amountToBuy);
    }

    /// @notice contract owner to withdraw all ETH
    function withdraw() external onlyOwner {
        // require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");

        (bool success,) = payable(owner).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    /// @notice   owner to update token price
    function setTokenPrice(uint256 _priceInWei) external onlyOwner {
        // require(msg.sender == owner, "Only owner");
        require(_priceInWei > 0, "Invalid price");
        tokenPriceInWei = _priceInWei;
    }

    /// @notice Accept ETH sent directly
    receive() external payable {}
}
