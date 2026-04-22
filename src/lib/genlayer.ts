import { testnetBradbury } from "genlayer-js/chains";
import { createClient, createAccount } from "genlayer-js";
import { TransactionStatus } from "genlayer-js/types";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export function getReadClient() {
  return createClient({ chain: testnetBradbury });
}

declare global {
  // eslint-disable-next-line no-var
  var __writeClient: ReturnType<typeof createClient> | undefined;
}

export function getWriteClient() {
  if (!global.__writeClient) {
    const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
    if (!privateKey) throw new Error("PRIVATE_KEY not set");
    const account = createAccount(privateKey);
    global.__writeClient = createClient({ chain: testnetBradbury, account });
  }
  return global.__writeClient;
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
  const send = async () => {
    const client = getWriteClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await client.writeContract({
      address: CONTRACT_ADDRESS,
      functionName,
      args: args as any[],
      value: BigInt(0),
    })) as string;
  };

  try {
    return await send();
  } catch (err: unknown) {
    const msg = String(err);
    if (msg.includes("nonce") || msg.includes("Nonce")) {
      console.warn(`[genlayer] Nonce error, resetting client and retrying...`);
      global.__writeClient = undefined;
      await new Promise((r) => setTimeout(r, 1500));
      return await send();
    }
    throw err;
  }
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
