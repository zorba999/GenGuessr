import { testnetBradbury } from "genlayer-js/chains";
import { createClient, createAccount } from "genlayer-js";
import { TransactionStatus } from "genlayer-js/types";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export function getReadClient() {
  return createClient({ chain: testnetBradbury });
}

export function getWriteClient() {
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
  if (!privateKey) throw new Error("PRIVATE_KEY not set");
  const account = createAccount(privateKey);
  return createClient({ chain: testnetBradbury, account });
}

export async function readContract(
  functionName: string,
  args: unknown[]
): Promise<unknown> {
  const client = getReadClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName,
    args: args as any[],
  });
}

export async function submitContract(
  functionName: string,
  args: unknown[]
): Promise<string> {
  const client = getWriteClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName,
    args: args as any[],
    value: BigInt(0),
  });
  return txHash as string;
}

export async function writeContract(
  functionName: string,
  args: unknown[],
  waitFor: "ACCEPTED" | "FINALIZED" = "ACCEPTED"
): Promise<unknown> {
  const client = getWriteClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName,
    args: args as any[],
    value: BigInt(0),
  });

  const receipt = await client.waitForTransactionReceipt({
    hash: txHash,
    status:
      waitFor === "FINALIZED"
        ? TransactionStatus.FINALIZED
        : TransactionStatus.ACCEPTED,
    interval: 3_000,
    retries: 60,
  });

  return receipt;
}
