const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PortfolioVault", function () {
  const WAD = 10n ** 18n;
  const MAX = 1_000_000n * WAD;

  async function deployFixture() {
    const [owner, agent, stranger] = await ethers.getSigners();
    const MockRWA = await ethers.getContractFactory("MockRWA");
    const tok = await MockRWA.deploy("Asset", "AST", MAX, owner.address);
    await tok.waitForDeployment();
    const tokAddr = await tok.getAddress();

    const Vault = await ethers.getContractFactory("PortfolioVault");
    const vault = await Vault.deploy(owner.address, agent.address);
    await vault.waitForDeployment();
    const vaultAddr = await vault.getAddress();

    const cfg = { targetPctBps: 10_000n, driftThresholdBps: 500n, active: true };
    await vault.addAsset(tokAddr, cfg);

    const depositAmt = 500n * WAD;
    await tok.approve(vaultAddr, depositAmt);
    await vault.deposit(tokAddr, depositAmt);

    return { vault, tok, tokAddr, vaultAddr, owner, agent, stranger, depositAmt };
  }

  it("deposit moves tokens to vault", async function () {
    const { vault, tok, tokAddr, owner, depositAmt } = await deployFixture();
    expect(await tok.balanceOf(await vault.getAddress())).to.equal(depositAmt);
    const [tokens, pct] = await vault.getCurrentAllocations();
    expect(tokens[0]).to.equal(tokAddr);
    expect(pct[0]).to.equal(10_000n);
  });

  it("executeRebalance decrease sends tokens to owner", async function () {
    const { vault, tok, tokAddr, owner, agent, depositAmt } = await deployFixture();
    const out = 100n * WAD;
    await vault.connect(agent).executeRebalance(tokAddr, false, out);
    expect(await tok.balanceOf(owner.address)).to.equal(MAX - depositAmt + out);
  });

  it("executeRebalance increase pulls from owner when approved", async function () {
    const { vault, tok, tokAddr, owner, agent, depositAmt } = await deployFixture();
    const back = 50n * WAD;
    await tok.approve(await vault.getAddress(), back);
    await vault.connect(agent).executeRebalance(tokAddr, true, back);
    expect(await tok.balanceOf(await vault.getAddress())).to.equal(depositAmt + back);
  });

  it("reverts rebalance for non-agent", async function () {
    const { vault, tok, tokAddr, stranger } = await deployFixture();
    await expect(vault.connect(stranger).executeRebalance(tokAddr, false, 1n)).to.be.revertedWithCustomError(
      vault,
      "NotAgent"
    );
  });

  it("withdrawYield records withdrawal and transfers", async function () {
    const { vault, tok, tokAddr, owner, stranger, depositAmt } = await deployFixture();
    const w = 50n * WAD;
    const hsp = ethers.keccak256(ethers.toUtf8Bytes("hsp-demo"));
    await vault.withdrawYield(tokAddr, stranger.address, w, hsp);
    expect(await tok.balanceOf(stranger.address)).to.equal(w);
    expect(await vault.withdrawalsLength()).to.equal(1n);
    const rec = await vault.getWithdrawal(0);
    expect(rec.recipient).to.equal(stranger.address);
    expect(rec.hspRef).to.equal(hsp);
  });
});
