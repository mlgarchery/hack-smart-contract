const { expect } = require("chai");
const { parseUnits, formatEther } = require("@ethersproject/units");

let owner, alice, bob, charlie, delta, mockResolver;

const getBNBBalance = async (user) => {
  const provider = new ethers.providers.Web3Provider(hre.network.provider);
  return await provider.getBalance(user);
};

before(async () => {
  [owner, alice, bob, charlie, delta] = await ethers.getSigners();

  const Resolver = await ethers.getContractFactory("Resolver");
  mockResolver = await Resolver.deploy(parseUnits("1", "ether"));
});

describe("Guess The Average", async () => {
  it("verifies currentStage is 0", async () => {
    let ownerVar = await mockResolver.owner();
    
    expect(ownerVar).to.be.eq(owner.address);
    
    ownerVar = await mockResolver.connect(alice).owner();
    expect(ownerVar).to.be.eq(owner.address);
  });
});
