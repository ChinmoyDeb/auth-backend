const fs = require("fs");
const crypto = require("crypto");
const { execSync } = require("child_process");

const challenge = fs
  .readFileSync("./PROOF_OF_SUBMISSION/challenge.txt", "utf8")
  .trim();

const commitHash = execSync("git rev-parse HEAD")
  .toString()
  .trim();

const message = challenge + commitHash;

const digest = crypto
  .createHash("sha256")
  .update(message)
  .digest();

const { privateKey, publicKey } =
  crypto.generateKeyPairSync("ec", {
    namedCurve: "prime256v1"
  });

const signature = crypto.sign(
  null,
  digest,
  privateKey
);

fs.writeFileSync(
  "./PROOF_OF_SUBMISSION/proof.txt",
  signature.toString("base64")
);

fs.writeFileSync(
  "./PROOF_OF_SUBMISSION/proof_pub.pem",
  publicKey.export({
    type: "spki",
    format: "pem"
  })
);

console.log("Proof generated successfully.");