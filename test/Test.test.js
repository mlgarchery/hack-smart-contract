const { expect } = require("chai");
const { parseUnits, formatEther } = require("@ethersproject/units");

let owner, mockWinnerTakesAll;

const getBNBBalance = async (user) => {
  const provider = new ethers.providers.Web3Provider(hre.network.provider);
  return await provider.getBalance(user);
};

before(async () => {
  [owner] = await ethers.getSigners();

  const MockWinnerTakesAll = await ethers.getContractFactory(
    "MockWinnerTakesAll"
  );
  mockWinnerTakesAll = await MockWinnerTakesAll.deploy();
});

describe("WinnerTakesAll", async () => {
  describe("setRewardsAtRound(...)", async () => {
    it("creates new rounds and verify number of rounds = 3", async () => {
      await mockWinnerTakesAll.createNewRounds(3);
      const numberOfRounds = await mockWinnerTakesAll.getRoundLength();

      expect(numberOfRounds).to.be.eq(3);
    });

    it("verifies owner can set & send 25 ether to WinnerTakesAll contract for a chosen round", async () => {
      // Set 25 ether as rewards for round 3 (index nbr 2) and send 25 ether
      expect(
        await mockWinnerTakesAll.setRewardsAtRound(2, {
          value: parseUnits("25", "ether"),
        })
      ).to.be.ok;
      // Verify WinnerTakesAll contract hash now 25 ether
      expect(await getBNBBalance(mockWinnerTakesAll.address)).to.be.eq(
        parseUnits("25", "ether")
      );

      // Verify 25 ether is registered for round 1
      expect(await mockWinnerTakesAll.rounds(2)).to.be.eq(
        parseUnits("25", "ether")
      );
    });

    it("fails on owner updating round's rewards as it is has already been set", async () => {
      await expect(
        mockWinnerTakesAll.setRewardsAtRound(2, {
          value: parseUnits("2", "ether"),
        })
      ).to.be.reverted;
    });

    it("fails on index round not existing when defining rewards for this index", async () => {
      await expect(
        mockWinnerTakesAll.setRewardsAtRound(10, {
          value: parseUnits("1", "ether"),
        })
      ).to.be.reverted;
    });
  });
});
