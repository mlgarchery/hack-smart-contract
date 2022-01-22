const { expect } = require("chai");
const { parseUnits, formatEther } = require("@ethersproject/units");

let owner, alice, bob, charlie, delta, mockWinnerTakesAll;

const getBNBBalance = async (user) => {
  const provider = new ethers.providers.Web3Provider(hre.network.provider);
  return await provider.getBalance(user);
};

before(async () => {
  [owner, alice, bob, charlie, delta] = await ethers.getSigners();

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

  describe("isAllowedAt(...)", async () => {
    it("verifies no one is allowed to participate to any new rounds by default", async () => {
      const array = await ethers.getSigners();

      for (let i = 0; i < 5; i++) {
        const user = array[i];
        expect(await mockWinnerTakesAll.isAllowedAt(0, user.address)).to.be
          .false;
        expect(await mockWinnerTakesAll.isAllowedAt(1, user.address)).to.be
          .false;
        expect(await mockWinnerTakesAll.isAllowedAt(2, user.address)).to.be
          .false;
      }
    });
  });

  describe("setRewardsAtRoundfor(...)", async () => {
    it("verifies owner and Alice are allowed to participated in round 3", async () => {
      await mockWinnerTakesAll.setRewardsAtRoundfor(2, [
        owner.address,
        alice.address,
      ]);
      // Verify rounds 3 participation for owner & Alice
      expect(await mockWinnerTakesAll.isAllowedAt(2, owner.address)).to.be.true;
      expect(await mockWinnerTakesAll.isAllowedAt(2, alice.address)).to.be.true;
    });

    it("verifies they are still excluded from other rounds", async () => {
      const array = await ethers.getSigners();

      for (let i = 0; i < 2; i++) {
        const user = array[i];
        expect(await mockWinnerTakesAll.isAllowedAt(0, user.address)).to.be
          .false;
        expect(await mockWinnerTakesAll.isAllowedAt(1, user.address)).to.be
          .false;
      }
    });
  });

  describe("withdrawRewards(...)", async () => {
    it("fails on Bob retrieving rewards of round 3", async () => {
      const oldBobETHBalance = parseFloat(
        formatEther(await getBNBBalance(bob.address))
      );

      await expect(mockWinnerTakesAll.connect(bob).withdrawRewards(2)).to.be
        .reverted;
      // Bob balance remains more or less the same, due to gas fees taken on failed rewards withdrawl
      expect(
        parseFloat(formatEther(await getBNBBalance(bob.address)))
      ).to.be.within(oldBobETHBalance - 1, oldBobETHBalance);
    });

    it("succeed on Alice retrieving her 25 ETH rewards of round 3", async () => {
      // , rounds[index].rewards should be 0 & Alice should have +25 ETH
      const oldAliceETHBalance = parseFloat(
        formatEther(await getBNBBalance(alice.address))
      );

      await mockWinnerTakesAll.connect(alice).withdrawRewards(2);
      // contract's amount should be 0
      expect(await getBNBBalance(mockWinnerTakesAll.address)).to.be.eq(0);
      expect(await mockWinnerTakesAll.rounds(2)).to.be.eq(0);
      // Due to gas fee, Alice can have less than 25ETH from rewards but for sure between +20 ETH and +25 ETH (max)
      expect(
        parseFloat(formatEther(await getBNBBalance(alice.address)))
      ).to.be.within(oldAliceETHBalance + 20, oldAliceETHBalance + 25);
    });
  });

  describe("clearRounds(...)", async () => {
    it("deletes all rounds data: rounds length is = 0", async () => {
      await mockWinnerTakesAll.clearRounds();

      expect(await mockWinnerTakesAll.getRoundLength()).to.be.eq(0);
    });

    it("fails on rewards amount of round as rounds' data have been deleted", async () => {
      for (let i = 0; i < 3; i++) {
        await expect(mockWinnerTakesAll.rounds(i)).to.be.reverted;
      }
    });

    it("fails on fetching addresses' allocation as rounds' data have been deleted", async () => {
      const array = await ethers.getSigners();

      for (let i = 0; i < 5; i++) {
        const user = array[i];
        await expect(mockWinnerTakesAll.isAllowedAt(0, user.address)).to.be
          .reverted;
        await expect(mockWinnerTakesAll.isAllowedAt(1, user.address)).to.be
          .reverted;
        await expect(mockWinnerTakesAll.isAllowedAt(2, user.address)).to.be
          .reverted;
      }
    });
    // verify all data from rounds have been deleted including rewards allocated to each round and addresses allowed to participate to each round
  });

  describe.skip("withdrawETH(...)", async () => {
    // verify the owner can withdraw ALL ETH inside WinerTakesAll contrac
  });
});
