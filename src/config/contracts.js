import { getContract } from "thirdweb";
import { client, chain } from "@/lib/thirdweb";

import UranoTokenABI from "@/abi/UranoToken.json";
import StakingABI from "@/abi/Staking.json";
import UranoGovernanceABI from "@/abi/UranoGovernance.json";
import VestingABI from "@/abi/Vesting.json";
import PresaleABI from "@/abi/Presale.json";
import MockUSDCABI from "@/abi/MockUSDC.json";
import UShareFactoryABI from "@/abi/uShareFactory.json";
import UShareMarketABI from "@/abi/uShareMarket.json";
import VeuranoABI from "@/abi/veUrano.json";
import UShareABI from "@/abi/uShare.json";
import UStakingABI from "@/abi/uStaking.json";

const abiOf = (artifact) => artifact.abi ?? artifact;

const getEnvAddress = (key) => import.meta.env[key]?.trim();

export const ADDRESSES = {
  URANO_TOKEN: getEnvAddress("VITE_URANO_TOKEN_CONTRACT_ADDRESS"),
  STAKING: getEnvAddress("VITE_STAKING_CONTRACT_ADDRESS"),
  VE_URANO: getEnvAddress("VITE_VE_URANO_CONTRACT_ADDRESS"),
  GOVERNANCE: getEnvAddress("VITE_URANO_GOVERNANCE_CONTRACT_ADDRESS"),
  VESTING: getEnvAddress("VITE_VESTING_CONTRACT_ADDRESS"),
  PRESALE: getEnvAddress("VITE_PRESALE_CONTRACT_ADDRESS"),
  USHARE_FACTORY: getEnvAddress("VITE_USHARE_FACTORY_CONTRACT_ADDRESS"),
  USHARE_MARKET: getEnvAddress("VITE_USHARE_MARKET_CONTRACT_ADDRESS"),
  USDC: getEnvAddress("VITE_MOCK_USDC_CONTRACT_ADDRESS"),
};

const getRequiredAddress = (address, label) => {
  if (!address) {
    throw new Error(`Missing contract address: ${label}`);
  }
  return address;
};

export const uranoToken = getContract({
  client,
  chain,
  address: getRequiredAddress(ADDRESSES.URANO_TOKEN, "URANO_TOKEN"),
  abi: abiOf(UranoTokenABI),
});

export const staking = getContract({
  client,
  chain,
  address: getRequiredAddress(ADDRESSES.STAKING, "STAKING"),
  abi: abiOf(StakingABI),
});

export const governance = getContract({
  client,
  chain,
  address: getRequiredAddress(ADDRESSES.GOVERNANCE, "GOVERNANCE"),
  abi: abiOf(UranoGovernanceABI),
});

export const vesting = getContract({
  client,
  chain,
  address: getRequiredAddress(ADDRESSES.VESTING, "VESTING"),
  abi: abiOf(VestingABI),
});

export const presale = getContract({
  client,
  chain,
  address: getRequiredAddress(ADDRESSES.PRESALE, "PRESALE"),
  abi: abiOf(PresaleABI),
});

export const uShareFactory = getContract({
  client,
  chain,
  address: getRequiredAddress(ADDRESSES.USHARE_FACTORY, "USHARE_FACTORY"),
  abi: abiOf(UShareFactoryABI),
});

export const uShareMarket = getContract({
  client,
  chain,
  address: getRequiredAddress(ADDRESSES.USHARE_MARKET, "USHARE_MARKET"),
  abi: abiOf(UShareMarketABI),
});

export const usdc = getContract({
  client,
  chain,
  address: getRequiredAddress(ADDRESSES.USDC, "USDC"),
  abi: abiOf(MockUSDCABI),
});

export const veUrano = getContract({
  client,
  chain,
  address: getRequiredAddress(ADDRESSES.VE_URANO, "VE_URANO"),
  abi: abiOf(VeuranoABI),
});

export const getUShareContract = (address) =>
  getContract({
    client,
    chain,
    address,
    abi: abiOf(UShareABI),
  });

export const getUStakingContract = (address) =>
  getContract({
    client,
    chain,
    address,
    abi: abiOf(UStakingABI),
  });
