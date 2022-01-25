const { expect } = require("chai");
const { parseUnits, formatEther } = require("@ethersproject/units");

let owner, alice, bob, charlie, delta, store;

const getBNBBalance = async (user) => {
  const provider = new ethers.providers.Web3Provider(hre.network.provider);
  return await provider.getBalance(user);
};

before(async () => {
  [owner, alice, bob, charlie, delta] = await ethers.getSigners();

  const Store = await ethers.getContractFactory("contracts/SolidityHackingWorkshopV8.sol:Store");
  store = await Store.deploy();
});

describe("LinearBondedCurve", async () => {
  it("stores", async () => {
    const oldBalance = await getBNBBalance(owner.address);

    await store.store({
      value: parseUnits("10", "ether"),
    });

    const newBalance = await getBNBBalance(owner.address);
    expect(oldBalance).to.be.gt(newBalance);
  });
  
  it("takes", async () => {
    const oldBalance = await getBNBBalance(owner.address);

    await store.take({
      value: parseUnits("10", "ether"),
    });

    const newBalance = await getBNBBalance(owner.address);
    expect(oldBalance).to.be.lt(newBalance);
  });
});
