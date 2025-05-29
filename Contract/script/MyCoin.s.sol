// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MyToken} from "../src/MyCoin.sol";

contract MyTokenScript is Script {
    MyToken public mytoken;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        mytoken = new MyToken();

        vm.stopBroadcast();
    }
}
