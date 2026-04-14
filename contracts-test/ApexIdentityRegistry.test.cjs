const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ApexIdentityRegistry", function () {
  it("supports verifier attest/revoke and eligibility checks", async function () {
    const [owner, verifier, user] = await ethers.getSigners();
    const C = await ethers.getContractFactory("ApexIdentityRegistry");
    const c = await C.deploy(owner.address);
    await c.waitForDeployment();

    await c.connect(owner).setVerifier(verifier.address, true);
    expect(await c.verifiers(verifier.address)).to.equal(true);

    const claim = ethers.keccak256(ethers.toUtf8Bytes("user-self-claim"));
    await c.connect(user).submitSelfClaim(claim);
    const before = await c.identities(user.address);
    expect(before.selfClaimHash).to.equal(claim);

    const attHash = ethers.keccak256(ethers.toUtf8Bytes("attestation"));
    await c.connect(verifier).attestIdentity(user.address, 2, attHash);

    expect(await c.isEligible(user.address, 1)).to.equal(true);
    expect(await c.isEligible(user.address, 2)).to.equal(true);
    expect(await c.isEligible(user.address, 3)).to.equal(false);

    await c.connect(verifier).revokeIdentity(user.address);
    expect(await c.isEligible(user.address, 1)).to.equal(false);
  });
});

