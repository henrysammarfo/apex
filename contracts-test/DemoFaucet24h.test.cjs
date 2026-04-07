const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DemoFaucet24h", function () {
  const WAD = 10n ** 18n;
  const MAX = 10_000_000n * WAD;
  const CLAIM = 100n * WAD;
  const POT = 10_000n * WAD;

  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const MockRWA = await ethers.getContractFactory("MockRWA");
    const token = await MockRWA.deploy("Faucet Token", "FT", MAX, owner.address);
    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();

    const Faucet = await ethers.getContractFactory("DemoFaucet24h");
    const faucet = await Faucet.deploy(tokenAddr, CLAIM, owner.address);
    await faucet.waitForDeployment();
    const faucetAddr = await faucet.getAddress();

    await token.transfer(faucetAddr, POT);
    return { token, faucet, owner, alice, bob, faucetAddr };
  }

  it("claim transfers from pool without minting; supply unchanged", async function () {
    const { token, faucet, alice, faucetAddr } = await deployFixture();
    const supplyBefore = await token.totalSupply();

    await faucet.connect(alice).claim();
    expect(await token.balanceOf(alice.address)).to.equal(CLAIM);
    expect(await token.balanceOf(faucetAddr)).to.equal(POT - CLAIM);
    expect(await token.totalSupply()).to.equal(supplyBefore);
  });

  it("enforces 24h cooldown per address", async function () {
    const { faucet, alice } = await deployFixture();
    await faucet.connect(alice).claim();
    await expect(faucet.connect(alice).claim()).to.be.revertedWithCustomError(faucet, "CooldownActive");
  });

  it("allows another address to claim same period", async function () {
    const { faucet, alice, bob, token } = await deployFixture();
    await faucet.connect(alice).claim();
    await faucet.connect(bob).claim();
    expect(await token.balanceOf(bob.address)).to.equal(CLAIM);
  });

  it("reverts when pool too low", async function () {
    const [owner, poor] = await ethers.getSigners();
    const MockRWA = await ethers.getContractFactory("MockRWA");
    const token = await MockRWA.deploy("P", "P", MAX, owner.address);
    await token.waitForDeployment();
    const Faucet = await ethers.getContractFactory("DemoFaucet24h");
    const faucet = await Faucet.deploy(await token.getAddress(), CLAIM, owner.address);
    await faucet.waitForDeployment();
    await token.transfer(await faucet.getAddress(), CLAIM - 1n);
    await expect(faucet.connect(poor).claim()).to.be.revertedWithCustomError(faucet, "InsufficientBalance");
  });
});
