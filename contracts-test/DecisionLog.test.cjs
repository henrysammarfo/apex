const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecisionLog", function () {
  it("only agent can log; owner can rotate agent", async function () {
    const [owner, agent, other, newAgent] = await ethers.getSigners();
    const Log = await ethers.getContractFactory("DecisionLog");
    const log = await Log.deploy(owner.address, agent.address);
    await log.waitForDeployment();

    const portfolioId = ethers.keccak256(ethers.toUtf8Bytes("p1"));
    const reasoningHash = ethers.keccak256(ethers.toUtf8Bytes("reason"));
    const asset = ethers.Wallet.createRandom().address;

    await expect(
      log.connect(other).logDecision(portfolioId, asset, "hold", false, 0, 50, reasoningHash)
    ).to.be.revertedWithCustomError(log, "NotAgent");

    await log.connect(agent).logDecision(portfolioId, asset, "rebalance", true, 100, 87, reasoningHash);
    expect(await log.getDecisionCount()).to.equal(1n);

    await log.connect(owner).setAgent(newAgent.address);
    await log
      .connect(newAgent)
      .logDecision(portfolioId, asset, "hold", false, 0, 10, ethers.ZeroHash);
    expect(await log.getDecisionCount()).to.equal(2n);
  });
});
