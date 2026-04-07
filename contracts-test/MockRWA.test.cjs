const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockRWA (fixed supply)", function () {
  const WAD = 10n ** 18n;
  const MAX = 1_000_000n * WAD;

  it("mints full supply once to initial holder and never increases", async function () {
    const [, holder] = await ethers.getSigners();
    const MockRWA = await ethers.getContractFactory("MockRWA");
    const t = await MockRWA.deploy("Test", "TST", MAX, holder.address);
    await t.waitForDeployment();

    expect(await t.maxSupply()).to.equal(MAX);
    expect(await t.totalSupply()).to.equal(MAX);
    expect(await t.balanceOf(holder.address)).to.equal(MAX);

    const [, , other] = await ethers.getSigners();
    await t.connect(holder).transfer(other.address, WAD);
    expect(await t.totalSupply()).to.equal(MAX);
  });
});
