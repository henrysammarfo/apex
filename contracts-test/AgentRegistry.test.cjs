const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgentRegistry", function () {
  it("owner sets authorization and NexaID hash", async function () {
    const [owner, agent, user] = await ethers.getSigners();
    const Reg = await ethers.getContractFactory("AgentRegistry");
    const reg = await Reg.deploy(owner.address);
    await reg.waitForDeployment();

    expect(await reg.isAuthorized(agent.address)).to.equal(false);
    await reg.connect(owner).setAgentAuthorization(agent.address, true);
    expect(await reg.isAuthorized(agent.address)).to.equal(true);

    const hash = ethers.keccak256(ethers.toUtf8Bytes("nexaid"));
    await reg.connect(owner).verifyNexaId(user.address, hash);
    expect(await reg.nexaidHash(user.address)).to.equal(hash);
  });
});
