const { expect } = require("chai");

let owner, mockWinnerTakesAll;

before(async () => {
  [owner] = await ethers.getSigners();

  const MockWinnerTakesAll = await ethers.getContractFactory(
    "MockWinnerTakesAll"
  );
  mockWinnerTakesAll = await MockWinnerTakesAll.deploy();
});

describe("WinnerTakesAll", async () => {
  it("creates new rounds and verify number of rounds > 0", async () => {
    await mockWinnerTakesAll.createNewRounds(3);
    const numberOfRounds = await mockWinnerTakesAll.getRoundLength();

    console.log(numberOfRounds);
    expect(numberOfRounds).to.be.gt(0);
  });
});
