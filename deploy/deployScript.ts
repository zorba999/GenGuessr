import { testnetBradbury } from "genlayer-js/chains";
import { createClient, createAccount } from "genlayer-js";
import { TransactionStatus } from "genlayer-js/types";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
if (!privateKey) {
  throw new Error("PRIVATE_KEY not found in .env.local");
}

const account = createAccount(privateKey);
const client = createClient({ chain: testnetBradbury, account });

async function deploy() {
  console.log("🚀 Deploying GenGuessr contract to Bradbury testnet...");
  console.log("📍 Deployer address:", account.address);

  const contractCode = fs.readFileSync(
    path.join(__dirname, "../contracts/genguessr_v2.py"),
    "utf8"
  );

  const txHash = (await client.deployContract({
    code: contractCode,
    args: [],
  })) as `0x${string}` & { length: 66 };

  console.log("⏳ Deploy tx submitted:", txHash);
  console.log("⏳ Waiting for finalization (this may take a minute)...");

  const receipt = await client.waitForTransactionReceipt({
    hash: txHash,
    status: TransactionStatus.ACCEPTED,
    interval: 3_000,
    retries: 40,
  });

  const contractAddress = (receipt as any)?.recipient;
  console.log("✅ Contract deployed at:", contractAddress);
  console.log(
    "\n📝 Add this to your .env.local:\nNEXT_PUBLIC_CONTRACT_ADDRESS=" +
      contractAddress
  );
}

deploy().catch((err) => {
  console.error("❌ Deploy failed:", err);
  process.exit(1);
});
