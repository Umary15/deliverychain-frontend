import { ethers } from 'ethers'

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS

export const ABI = [
    "function createDelivery() external returns (uint256)",
    "function assignRider(uint256 _id) external",
    "function confirmPickup(uint256 _id) external",
    "function confirmDelivery(uint256 _id, string calldata _ipfsCID) external",
    "function raiseDispute(uint256 _id) external",
    "function resolveDispute(uint256 _id) external",
    "function recordSettlement(uint256 _id, bool _settled) external",
    "function getDelivery(uint256 _id) external view returns (tuple(uint256 id, address recordedBy, uint8 deliveryStatus, uint8 settlementStatus, string ipfsCID, uint256 createdAt, uint256 deliveredAt))",
    "function deliveryCount() external view returns (uint256)"
]

export function getContract(signerOrProvider) {
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, signerOrProvider)
}