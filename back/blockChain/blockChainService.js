
var Web3 = require('web3');
const axios = require("axios")
const Provider = require("@truffle/hdwallet-provider")
const Contract = require("./contracts/NFT.json")
const pinataSDK = require('@pinata/sdk');
const { pinataApiKey, pinataSecret, contractAdress, ownerAddress, ownerPrivateKey, blockChainURL, pinataUrl } = require('../config');


/**
 * Mine NFT function
 * First let check that the minor paid the transaction
 * Then, generate the NFT metadata
 * Then, generate a pin on pinata to this NFT
 * Then call the mint method of the smartcontract
 * @param {String} address 
 * @returns {Object} the receipt of the mining smartcontract function
 */
module.exports.mine = async(address, txHash) => {
    return new Promise(async (resolve, reject) => {
        let contract = getContract()
        let web3 = web3Instance()
        let transaction = await web3.eth.getTransaction(txHash)
        if(transaction !== undefined){
            if(Web3.utils.toChecksumAddress(transaction.from) === address && Web3.utils.toChecksumAddress(transaction.to) === ownerAddress){
                const pinata = pinataSDK(pinataApiKey, pinataSecret);
                const nftMined = createRandomNFT()
                const result = await pinata.pinJSONToIPFS(nftMined).catch(error => {
                    reject(error)
                })
                const receipt = await contract.methods.mint(address, result.IpfsHash).send({from: ownerAddress}).catch(error => {
                    reject(error)
                })
                resolve(receipt)
            }
        }
        reject("error during the transaction")
    })
}

/**
 * Get all NFT owned by the address you passed
 * @param {String} address 
 * @returns {Array} the NFT list
 */
module.exports.getNftByAddress = async (address) => {
    return new Promise(async (resolve, reject) => {
        let contract = getContract()
        const ammount = await contract.methods.balanceOf(address).call().catch(error => {
            reject(error)
        })
        let data = []
        let hashes = []
        for(let i = 0; i < ammount; i++){
            let nftIndex = await contract.methods.tokenOfOwnerByIndex(address, i).call().catch(error => {
                reject(error)
            })
            let nftHash = await contract.methods.tokenURI(nftIndex).call().catch(error => {
                reject(error)
            })
            //If we already fetched the hash, we do not fetch again (avoid 429 error)
            let hashAttr = hashes.find(el => {return el.hash === nftHash})
            let nft= {}
            if(hashAttr === undefined){
                let url = pinataUrl + nftHash
                nft = await axios.get(url).catch(error => {
                    reject(error)
                })
                hashes.push({
                    hash: nftHash,
                    metadata: nft.data
                })
                if(nft !== undefined){
                    if(nft.data !== undefined){
                        nft.data.indexId = nftIndex
                    }
                }
            } else {
                nft.data = {...hashAttr.metadata}
                nft.data.indexId = nftIndex
            }
            data.push(nft.data)
        }
        resolve(data)
    })
}

/**
 * Create the NFT metadata
 * @returns {Object} metadata
 */
const createRandomNFT = () => {
    const classes = ["electric", "fire", "plant", "water"]
    let randInt =  Math.floor(Math.random() * 4);
    return {
        class: classes[randInt]
    }

}

/**
 * Instanciate the contract with the config data
 * @returns {Object} the web3 contract object
 */
const getContract = () => {
    let provider = new Provider(ownerPrivateKey, blockChainURL)
    let web3 = new Web3(provider)
    let contract = new web3.eth.Contract(
        Contract.abi,
        contractAdress
    )
    return contract
}

/**
 * Get a Web3 instance
 * @returns {Object} Web3 instance
 */
const web3Instance = () => {
    let provider = new Provider(ownerPrivateKey, blockChainURL)
    return new Web3(provider)
}