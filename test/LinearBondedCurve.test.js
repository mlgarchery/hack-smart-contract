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
      value: parseUnits("0.5", "ether"),
    });

    let balances = await mockLinearBondedCurve.balances(owner.address);
    totalSupply = await mockLinearBondedCurve.totalSupply();

    console.log("balances: ", formatEther(balances));
    console.log("totalSupply: ", formatEther(totalSupply));

    await mockLinearBondedCurve.buy({
      value: parseUnits("3", "ether"),
    });

    balances = await mockLinearBondedCurve.balances(owner.address);
    totalSupply = await mockLinearBondedCurve.totalSupply();

    console.log("balances: ", formatEther(balances));
    console.log("totalSupply: ", formatEther(totalSupply));

    console.log(
      "contract has: %s ETH",
      formatEther(await getBNBBalance(await mockLinearBondedCurve.address))
    );
  });

  it("sells 1.25", async () => {
    await mockLinearBondedCurve.sell(parseUnits("1.25", "ether"));

    console.log(
      "contract has: %s ETH left",
      formatEther(await getBNBBalance(await mockLinearBondedCurve.address))
    );
  });
});
