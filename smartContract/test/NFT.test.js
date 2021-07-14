
const NFT = artifacts.require("./NFT.sol")

require("chai").use(require("chai-as-promised")).should()



contract("NFT", (accounts) => {


    describe("deployment", async() => {

        let contract = await NFT.deployed()
        it("deploys successfully", async() => {
            const address = contract.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, "")
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it("has a name", async() => {
            const name = await contract.name()
            assert.equal(name, "Elements NFT")
        })

        it("has a symbol", async() => {
            const symbol = await contract.symbol()
            assert.equal(symbol, "ELM")
        })
    })


    describe("mint", async() => {
        it("mines an nft for the adress given if the sender is the admin", async() => {
            let contract = await NFT.deployed({from: accounts[0]})
            await contract.mint(accounts[1], "123", {from: accounts[0]})
            let nftAddress = await contract.ownerOf(1)
            let tokenURI = await contract.tokenURI(1)
            assert.equal(nftAddress, accounts[1], "mine creation successful")
            assert.equal(tokenURI, "123", "tokenURI match")
        })
    })

})