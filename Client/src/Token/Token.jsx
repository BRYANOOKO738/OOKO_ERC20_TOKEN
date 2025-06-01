import React, { useState, useEffect } from 'react';
import { Wallet, Loader2, TrendingUp, Shield, Users, Clock, AlertCircle } from 'lucide-react';
import TokenJson from "../Constants/Contract.json"
import { ethers } from 'ethers';

export default function TokenSaleDApp() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [userAddress, setUserAddress] = useState('');
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [ethAmount, setEthAmount] = useState('');
    const [saleProgress, setSaleProgress] = useState(65);
    const [userTokenBalance, setUserTokenBalance] = useState(0);
    const [activeTab, setActiveTab] = useState('purchase');
    const [provider, setProvider] = useState('');
    const [signer, setSigner] = useState('');
    const [loading, setLoading] = useState(false);


    // Transfer state
    const [transferRecipient, setTransferRecipient] = useState('');
    const [transferAmount, setTransferAmount] = useState('');

    // Approve state
    const [approveSpender, setApproveSpender] = useState('');
    const [approveAmount, setApproveAmount] = useState('');

    // Allowance state
    const [allowanceOwner, setAllowanceOwner] = useState('');
    const [allowanceSpender, setAllowanceSpender] = useState('');
    const [allowanceAmount, setAllowanceAmount] = useState('0');

    // Mock data - in real implementation, these would come from smart contract
    const [saleData, setSaleData] = useState({
        tokenName: 'OOKO',
        tokenSymbol: '0K',
        tokenPrice: 0.001, // ETH per token
        totalSupply: 1000000,
        tokensSold: 650000,
        tokensRemaining: 350000,
        saleEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        minPurchase: 100,
        maxPurchase: 10000
    });

    const getAddress = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(provider);
            const signer = provider.getSigner();
            setSigner(signer);
            const address = await signer.getAddress();
            setUserAddress(address);
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const connectWebsite = async () => {
        if (!window.ethereum) {
            alert('MetaMask not detected!');
            return;
        }

        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0xaa36a7') {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }],
                });
            }

            await window.ethereum.request({ method: 'eth_requestAccounts' });


            await getAddress();
            setWalletConnected(true);
        } catch (err) {
            console.error('Error connecting wallet:', err);
        }
    };

    useEffect(() => {
        if (!window.ethereum) return;

        const checkConnection = async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setWalletConnected(true);
                    setUserAddress(accounts[0]);

                }
            } catch (err) {
                console.error('Error checking connection:', err);
            }
        };

        checkConnection();

        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                setConnected(false);
                setWalletConnected('');
            } else {
                setWalletConnected(true);
                setWalletConnected(accounts[0]);
            }
            window.location.replace(location.pathname);
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);

        return () => {
            if (window.ethereum.removeListener) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, [location.pathname]);

    const handleTransfer = async () => {
        if (!walletConnected) {
          alert('Please connect your wallet first');
          return;
        }
      
        try {
          setLoading(true);
      
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
      
          const contract = new ethers.Contract(
            TokenJson.address,
            TokenJson.abi,
            signer
          );
      
         
          const amountInUnits = ethers.parseUnits(transferAmount, 18); // ✅ correct

      
          // ✅ Transfer tokens
          const transaction = await contract.transfer(transferRecipient, amountInUnits);
          await transaction.wait();
      
          alert(`Transferred ${transferAmount} OK to ${transferRecipient}`);
          setUserTokenBalance((prev) => prev - parseFloat(transferAmount)); // for UI only
          setTransferAmount('');
          setTransferRecipient('');
        } catch (err) {
          console.error('Transaction failed:', err);
          alert('Transaction failed. See console for details.');
        } finally {
          setLoading(false);
        }
      };
      

    const handleApprove = async() => {
        if (!walletConnected) {
            alert('Please connect your wallet first');
            return;
        }
        try {
            setLoading(true);
        
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
        
            const contract = new ethers.Contract(
              TokenJson.address,
              TokenJson.abi,
              signer
            );
        
           
            const amountInUnits = ethers.parseUnits(approveAmount, 18); // ✅ correct
  
        
            // ✅ Transfer tokens
            const approving = await contract.approve(approveSpender, amountInUnits);
            await approving.wait();
        
            alert(`Approving ${approveAmount} ${saleData.tokenSymbol} for ${approveSpender}`);
            setApproveSpender('');
            setApproveAmount('');
          } catch (err) {
            console.error('Transaction failed:', err);
            alert('Transaction failed. See console for details.');
          } finally {
            setLoading(false);
          }

        // Mock approve transaction
       
    };

    const handleCheckAllowance = async() => {
        if (!allowanceOwner || !allowanceSpender) {
            alert('Please enter both owner and spender addresses');
            return;
        }

        try {
            setLoading(true);
        
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
        
            const contract = new ethers.Contract(
              TokenJson.address,
              TokenJson.abi,
              signer
            );
        
        
            // ✅ Transfer tokens
            const allawence = await contract.allowance(allowanceOwner, allowanceSpender);
            
            const formattedAllowance = ethers.formatUnits(allawence, 18);
            setAllowanceAmount(formattedAllowance);
        
          } catch (err) {
            console.error('Transaction failed:', err);
            alert('Transaction failed. See console for details.');
          } finally {
            setLoading(false);
          }

    };

    const handlePurchaseAmountChange = (value) => {
        setPurchaseAmount(value);
        setEthAmount((value * saleData.tokenPrice).toFixed(6));
    };
    useEffect(() => {
        const handleGetBalanceOF = async () => {

            
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);

                const signer = await provider.getSigner();
                const contract = new ethers.Contract(
                    TokenJson.address,
                    TokenJson.abi,
                    signer
                );

                const balance = await contract.balanceOf(userAddress);

                const formattedBalance = ethers.formatUnits(balance, 18);
                setUserTokenBalance(formattedBalance);

            } catch (err) {
                console.error('Error getting token balance:', err);
            }
        };

        handleGetBalanceOF();
    }, [signer, userAddress]);



    const handleEthAmountChange = (value) => {
        setEthAmount(value);
        setPurchaseAmount(Math.floor(value / saleData.tokenPrice).toString());
    };

    const purchaseTokens = async () => {
        if (!walletConnected) {
            alert('Please connect your wallet first');
            return;
        }

        try {
            setLoading(true);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(
                TokenJson.address,
                TokenJson.abi,
                signer
            );

            // Convert ETH to wei
            const valueInWei = ethers.parseEther(ethAmount); // ✅ fixes error

            // Buy tokens
            const transaction = await contract.buyTokens({ value: valueInWei });
            await transaction.wait();

            // Optional: Parse token amount to integer
            const amount = parseInt(purchaseAmount);

            alert(`Purchased ${purchaseAmount} ${saleData.tokenSymbol} for ${ethAmount} ETH`);
            setUserTokenBalance((prev) => prev + amount);
            setPurchaseAmount('');
            setEthAmount('');
        } catch (err) {
            console.error('Transaction failed:', err);
            alert('Transaction failed. See console for details.');
        } finally {
            setLoading(false);
        }
    };

    const formatTimeRemaining = () => {
        const now = new Date();
        const timeRemaining = saleData.saleEndTime - now;
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return `${days}d ${hours}h`;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="flex items-center space-x-3 mb-4 md:mb-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
                            OK
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold">OOKOToken Sale</h1>
                    </div>

                    {!walletConnected ? (
                        <button
                            onClick={connectWebsite}
                            style={
                                { cursor: "pointer" }
                            }
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            <Wallet size={20} />
                            <span>Connect Wallet</span>
                        </button>
                    ) : (
                        <div className="flex items-center space-x-3 bg-gray-800 px-4 py-2 rounded-xl">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-mono">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
                        </div>
                    )}
                </div>

                {/* Sale Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex items-center space-x-3 mb-2">
                            <Wallet className="text-yellow-500" size={24} />
                            <h3 className="font-semibold">Your Balance</h3>
                        </div>
                        <p className="text-2xl font-bold">{userTokenBalance}</p>
                        <p className="text-gray-400 text-sm">{saleData.tokenSymbol} tokens</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex items-center space-x-3 mb-2">
                            <TrendingUp className="text-green-500" size={24} />
                            <h3 className="font-semibold">Tokens Sold</h3>
                        </div>
                        <p className="text-2xl font-bold">{saleData.tokensSold.toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">of {saleData.totalSupply.toLocaleString()}</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex items-center space-x-3 mb-2">
                            <Shield className="text-blue-500" size={24} />
                            <h3 className="font-semibold">Token Price</h3>
                        </div>
                        <p className="text-2xl font-bold">{saleData.tokenPrice} ETH</p>
                        <p className="text-gray-400 text-sm">per {saleData.tokenSymbol}</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex items-center space-x-3 mb-2">
                            <Users className="text-purple-500" size={24} />
                            <h3 className="font-semibold">Progress</h3>
                        </div>
                        <p className="text-2xl font-bold">{saleProgress}%</p>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${saleProgress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex items-center space-x-3 mb-2">
                            <Clock className="text-orange-500" size={24} />
                            <h3 className="font-semibold">Time Left</h3>
                        </div>
                        <p className="text-2xl font-bold">{formatTimeRemaining()}</p>
                        <p className="text-gray-400 text-sm">until sale ends</p>
                    </div>
                </div>

                {/* Main Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tab Navigation */}
                    <div className="lg:col-span-2">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[
                                { id: 'purchase', label: 'Buy Tokens' },
                                { id: 'transfer', label: 'Transfer' },
                                { id: 'approve', label: 'Approve' },
                                { id: 'allowance', label: 'Allowance' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                            {activeTab === 'purchase' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Purchase Tokens</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Token Amount</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={purchaseAmount}
                                                    onChange={(e) => handlePurchaseAmountChange(e.target.value)}
                                                    placeholder="Enter token amount"
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min={saleData.minPurchase}
                                                    max={saleData.maxPurchase}
                                                />
                                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">
                                                    {saleData.tokenSymbol}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Min: {saleData.minPurchase} • Max: {saleData.maxPurchase} tokens
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center">
                                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                                <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">ETH Amount</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={ethAmount}
                                                    onChange={(e) => handleEthAmountChange(e.target.value)}
                                                    placeholder="Enter ETH amount"
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    step="0.000001"
                                                />
                                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">
                                                    ETH
                                                </span>
                                            </div>
                                        </div>

                                        {purchaseAmount && (
                                            <div className="bg-gray-700 p-4 rounded-xl">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-300">You will receive:</span>
                                                    <span className="font-bold">{purchaseAmount} {saleData.tokenSymbol}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-300">Total cost:</span>
                                                    <span className="font-bold">{ethAmount} ETH</span>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={purchaseTokens}
                                            style={{ cursor: "pointer" }}
                                            disabled={!walletConnected || !purchaseAmount}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="animate-spin h-5 w-5" />
                                                    Processing...
                                                </>
                                            ) : (
                                                walletConnected ? 'PURCHASE TOKENS' : 'CONNECT WALLET TO PURCHASE'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'transfer' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Transfer Tokens</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Recipient Address</label>
                                            <input
                                                type="text"
                                                value={transferRecipient}
                                                onChange={(e) => setTransferRecipient(e.target.value)}
                                                placeholder="Enter recipient address"
                                                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Amount</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={transferAmount}
                                                    onChange={(e) => setTransferAmount(e.target.value)}
                                                    placeholder="Enter amount"
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    max={userTokenBalance}
                                                />
                                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">
                                                    {saleData.tokenSymbol}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Available: {userTokenBalance.toLocaleString()} {saleData.tokenSymbol}
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleTransfer}
                                            style={{cursor:"pointer"}}
                                            disabled={!walletConnected || !transferRecipient || !transferAmount}
                                            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                                        >
                                           {loading ? (
                                                <>
                                                    <Loader2 className="animate-spin h-5 w-5" />
                                                    Processing...
                                                </>
                                            ) : (
                                                walletConnected ? 'Transfer' : 'CONNECT WALLET TO PURCHASE'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'approve' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Approve Spending</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Spender Address</label>
                                            <input
                                                type="text"
                                                value={approveSpender}
                                                onChange={(e) => setApproveSpender(e.target.value)}
                                                placeholder="Enter spender address"
                                                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Amount</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={approveAmount}
                                                    onChange={(e) => setApproveAmount(e.target.value)}
                                                    placeholder="Enter amount"
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">
                                                    {saleData.tokenSymbol}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleApprove}
                                            disabled={!walletConnected || !approveSpender || !approveAmount}
                                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="animate-spin h-5 w-5" />
                                                    Processing...
                                                </>
                                            ) : (
                                                walletConnected ? 'APROVE TOKENS' : 'CONNECT WALLET TO PURCHASE'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'allowance' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Check Allowance</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Owner Address</label>
                                            <input
                                                type="text"
                                                value={allowanceOwner}
                                                onChange={(e) => setAllowanceOwner(e.target.value)}
                                                placeholder="Enter owner address"
                                                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Spender Address</label>
                                            <input
                                                type="text"
                                                value={allowanceSpender}
                                                onChange={(e) => setAllowanceSpender(e.target.value)}
                                                placeholder="Enter spender address"
                                                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                            />
                                        </div>

                                        {allowanceAmount !== '0' && (
                                            <div className="bg-gray-700 p-4 rounded-xl">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-300">Current Allowance:</span>
                                                    <span className="font-bold text-xl">{allowanceAmount} {saleData.tokenSymbol}</span>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleCheckAllowance}
                                            disabled={!allowanceOwner || !allowanceSpender}
                                            // style={{courso}}
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                                        >
                                           {loading ? (
                                                <>
                                                    <Loader2 className="animate-spin h-5 w-5" />
                                                    Processing...
                                                </>
                                            ) : (
                                                walletConnected ? 'CHECK ALLOWANCE' : 'CONNECT WALLET TO PURCHASE'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sale Information */}
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                            <h3 className="text-xl font-bold mb-4">Sale Information</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Token Name:</span>
                                    <span className="font-semibold">{saleData.tokenName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Symbol:</span>
                                    <span className="font-semibold">{saleData.tokenSymbol}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Total Supply:</span>
                                    <span className="font-semibold">{saleData.totalSupply.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Remaining:</span>
                                    <span className="font-semibold text-green-400">{saleData.tokensRemaining.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/30 p-6 rounded-2xl">
                            <div className="flex items-center space-x-3 mb-3">
                                <AlertCircle className="text-orange-500" size={24} />
                                <h3 className="text-lg font-bold">Important Notice</h3>
                            </div>
                            <ul className="text-sm text-gray-300 space-y-2">
                                <li>• Tokens will be distributed after purchase</li>
                                <li>• All sales are final</li>
                                <li>• Minimum purchase: {saleData.minPurchase} tokens</li>
                                <li>• Maximum purchase: {saleData.maxPurchase} tokens</li>
                                <li>• Sale ends in {formatTimeRemaining()}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}