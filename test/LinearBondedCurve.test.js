const { expect } = require("chai");
const { parseUnits, formatEther } = require("@ethersproject/units");

let owner, alice, bob, charlie, delta, mockLinearBondedCurve;

const getBNBBalance = async (user) => {
  const provider = new ethers.providers.Web3Provider(hre.network.provider);
  return await provider.getBalance(user);
};

before(async () => {
  [owner, alice, bob, charlie, delta] = await ethers.getSigners();

  const LinearBondedCurve = await ethers.getContractFactory(
    "MockLinearBondedCurve"
  );
  mockLinearBondedCurve = await LinearBondedCurve.deploy();
});

describe("LinearBondedCurve", async () => {
  it("verifies currentStage is 0", async () => {
    await mockLinearBondedCurve.buy({
      value: parseUnits("10", "ether"),
    });
    await mockLinearBondedCurve.buy({
      value: parseUnits("20", "ether"),
    });
    await mockLinearBondedCurve.buy({
      value: parseUnits("30", "ether"),
    });

    const balances = await mockLinearBondedCurve.balances(owner.address);
    const totalSupply = await mockLinearBondedCurve.totalSupply();

    console.log("balances: ", formatEther(balances));
    console.log("totalSupply: ", formatEther(totalSupply));
  });
});
