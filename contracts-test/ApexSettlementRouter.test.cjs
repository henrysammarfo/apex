const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ApexSettlementRouter", function () {
  const WAD = 10n ** 18n;
  const MAX = 1_000_000n * WAD;

  async function fixture() {
    const [owner, operator, requester, recipient] = await ethers.getSigners();
    const MockRWA = await ethers.getContractFactory("MockRWA");
    const token = await MockRWA.deploy("Mock", "M", MAX, requester.address);
    await token.waitForDeployment();

    const Router = await ethers.getContractFactory("ApexSettlementRouter");
    const r = await Router.deploy(owner.address);
    await r.waitForDeployment();
    await r.connect(owner).setOperator(operator.address, true);

    return { owner, operator, requester, recipient, token, r };
  }

  it("escrows then completes settlement", async function () {
    const { requester, recipient, token, r, operator } = await fixture();
    const amt = 100n * WAD;
    await token.connect(requester).approve(await r.getAddress(), amt);
    const req = ethers.keccak256(ethers.toUtf8Bytes("req-1"));
    await r.connect(requester).requestSettlement(recipient.address, await token.getAddress(), amt, 0, req);

    expect(await token.balanceOf(await r.getAddress())).to.equal(amt);
    const rec = ethers.keccak256(ethers.toUtf8Bytes("ok"));
    await r.connect(operator).completeSettlement(1, rec);
    expect(await token.balanceOf(recipient.address)).to.equal(amt);
  });

  it("returns escrow on fail", async function () {
    const { requester, recipient, token, r, operator } = await fixture();
    const amt = 50n * WAD;
    await token.connect(requester).approve(await r.getAddress(), amt);
    await r
      .connect(requester)
      .requestSettlement(recipient.address, await token.getAddress(), amt, 1, ethers.keccak256(ethers.toUtf8Bytes("req-2")));
    const before = await token.balanceOf(requester.address);
    await r.connect(operator).failSettlement(1, ethers.keccak256(ethers.toUtf8Bytes("fail")));
    const after = await token.balanceOf(requester.address);
    expect(after).to.equal(before + amt);
  });
});

