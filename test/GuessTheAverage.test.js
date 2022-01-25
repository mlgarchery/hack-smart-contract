const { expect } = require("chai");
const { parseUnits, formatEther } = require("@ethersproject/units");

let owner, alice, bob, charlie, delta, mockGuessTheAverage;

const getBNBBalance = async (user) => {
  const provider = new ethers.providers.Web3Provider(hre.network.provider);
  return await provider.getBalance(user);
};

before(async () => {
  [owner, alice, bob, charlie, delta] = await ethers.getSigners();

  const MockGuessTheAverage = await ethers.getContractFactory(
    "MockGuessTheAverage"
  );
  mockGuessTheAverage = await MockGuessTheAverage.deploy(1245, 1903);
});

describe("Guess The Average", async () => {
  it("verifies currentStage is 0", async () => {
    expect(await mockGuessTheAverage.currentStage()).to.be.eq(0);
  });

  it("verifies vars update", async () => {
    await mockGuessTheAverage.chainVars();

    expect(await mockGuessTheAverage.cursorDistribute()).to.be.eq(1);
    expect(await mockGuessTheAverage.numberOfLosers()).to.be.eq(1);
  });

  it("verifies vars update", async () => {
    const res = await mockGuessTheAverage.printFor();

    expect(res).to.be.eq(1);
  });
});
