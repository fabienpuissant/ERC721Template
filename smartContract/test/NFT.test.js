const NFT = artifacts.require("./NFT.sol");

require("chai").use(require("chai-as-promised")).should();

contract("NFT", (accounts) => {
  it("deploys successfully", async () => {
    let contract = await NFT.deployed();
    const address = contract.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("has a name Element NFT", async () => {
    let contract = await NFT.deployed();

    const name = await contract.name();
    assert.equal(name, "Elements NFT");
  });

  it("has a symbol ELM", async () => {
    let contract = await NFT.deployed();
    const symbol = await contract.symbol();
    assert.equal(symbol, "ELM");
  });

  it("mines an nft for the adress given if the sender is the admin", async () => {
    let contract = await NFT.deployed({ from: accounts[0] });
    await contract.mint(accounts[1], "123", { from: accounts[0] });
    let nftAddress = await contract.ownerOf(1);
    let tokenURI = await contract.tokenURI(1);
    assert.equal(nftAddress, accounts[1], "mine creation successful");
    assert.equal(tokenURI, "123", "tokenURI match");
  });

  it("not mines an nft for the adress given if the sender is not the admin", async () => {
    let contract = await NFT.deployed({ from: accounts[0] });
    try {
      assert.fail(
        await contract.mint(accounts[1], "123", { from: accounts[1] })
      );
    } catch (err) {
      assert.include(
        err.message,
        "revert only owner",
        "The error message should contain 'revert only owner'"
      );
    }
  });
});
