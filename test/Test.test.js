const { expect } = require("chai");

let owner, test;

before(async () => {
  [owner] = await ethers.getSigners();

  const Test = await ethers.getContractFactory("Test");
  test = await Test.deploy();
});

describe("Test", async () => {
  it("pushes some index", async () => {
    await test.createNewRounds(3);

    console.log(await test.getRoundLength());
  });
});
