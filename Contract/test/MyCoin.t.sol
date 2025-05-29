// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/MyCoin.sol";

contract MyTokenTest is Test {
    MyToken token;
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        token = new MyToken();
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
    }

    function testBuyTokensDirectCall() public {
        vm.prank(alice);
        token.buyTokens{value: 1 ether}();

        uint256 expectedAmount = (1 ether * 10 ** token.decimals()) / token.tokenPriceInWei();
        assertEq(token.balanceOf(alice), expectedAmount);
    }

    function testSetTokenPrice() public {
        uint256 newPrice = 0.002 ether;
        token.setTokenPrice(newPrice);
        assertEq(token.tokenPriceInWei(), newPrice);
    }

    function testSetTokenPrice_RevertIfNotOwner() public {
        vm.prank(bob);
        vm.expectRevert("Only owner can call this function");
        token.setTokenPrice(0.002 ether);
    }

    function testWithdraw_RevertIfNotOwner() public {
        vm.prank(bob);
        vm.expectRevert("Only owner can call this function");
        token.withdraw();
    }

    function testWithdraw_RevertIfNoETH() public {
        vm.prank(token.owner());
        vm.expectRevert("No ETH to withdraw");
        token.withdraw();
    }

    function testBuyTokens_RevertIfZeroETH() public {
        vm.prank(alice);
        vm.expectRevert("Send ETH to buy tokens");
        token.buyTokens{value: 0}();
    }

    function testBuyTokens_RevertIfNotEnoughTokensInReserve() public {
        // Owner transfers all tokens to a black hole
        token.transfer(address(0xdead), token.totalSupply());

        vm.prank(alice);
        vm.expectRevert("Not enough tokens in reserve");
        token.buyTokens{value: 1 ether}();
    }
}
