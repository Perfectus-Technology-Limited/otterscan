import { getChainNetworkByChainId, Network } from './chainList';
import { ethers, utils, Contract } from 'ethers';
import { configs } from './web3.config';

export const getTokenBalanceByWalletAddress = async (
  contractAddress: string,
  searchAddress: string,
  provider: ethers.providers.JsonRpcProvider

): Promise<string> => {
  let searchAddressTokenBalance = '0';
  try {
    if (contractAddress && searchAddress) {
      const eRC20ContractABI = JSON.parse(configs.commonContractABI);
      const contractInstance = new Contract(contractAddress, eRC20ContractABI, provider) as Contract;
      const tokenDecimalsResponse = await contractInstance.decimals();
      const tokenDecimals = parseInt(tokenDecimalsResponse.toString());
      const tokenBalanceResponse = await contractInstance.balanceOf(searchAddress);
      const tokenBalanceUnformatted = tokenBalanceResponse.toString();
      searchAddressTokenBalance = utils.formatUnits(tokenBalanceUnformatted, tokenDecimals);
      return searchAddressTokenBalance;
    } else {
      return searchAddressTokenBalance;
    }
  } catch (error) {
    let errorMessage = 'Error while fetching user token balance';
    throw new Error(errorMessage);
  }
};

