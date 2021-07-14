# Base template for ERC721 NFT

![App Preview](/views/app.png "App preview")

![transaction Preview](/views/transaction.png "transaction preview")

This template project regroup the code of a base ERC721 project.
- The smart contract :
	Using truffle and solidity to write and deploy the smart contract. Pinata, will be used to store the NFT metadata.
- The back-end :
	Using express to interact with the contract
- The front-ent :
	Using ReactJS to display NFT and communicate with the back-end and Metamask to interact with the blockchain


# 1 Deploy the smart contract

Let's have a look of the ./smartContract folder. You'll find a truffle project including a smart contract NFT.sol which will represent our NFT. The NFT uses the @openzeppelin standard but I added the _setTokenURI (removed in the recent verisions of openzeppelin) to link the NFT to his metadata store in Pinata. If you use a premium version of Pinata, you can remove this function and remove the call in the mint method because you'll be able to create a specific gateway to your NFT. As a result, you don't have to link manually your NFT to his metadata because the indexId of the NFT will be enough to reference it in your specific gateway.

Add whatever your want in the NFT contract then deploy it with truffle.

# 2 Back-end

You'll find a node project in the ./back folder, and we need to add some configuration to this depending of the contract you've deployed.
First, add your **NFT.json** in the back folder **./back/blockChain/contracts**. You'll find yours in the smartContract project **./smartContract/buils/contracts/NFT.json**.
Then open the **config.js** file and replace all the constants with your data :
	- **pinataApiKey** : your pinata api key to create the pin and store the metadata
	-  **pinataSecret** : your pinata api key to create the pin and store the metadata
	- **contractAdress** : the smart contract address that you've created
	- **ownerAddress** : the owner address of the smart contract because only the owner will be able to mine
	- **ownerPrivateKey** : the owner private key of the smart contract because only the owner will be able to mine
- **blockChainURL** : the blockchain Url where you deployed the smart contract
-  **pinataUrl** : the base pinata Url where the metadata are store (keep the provided if you don't own your repository on pinata)

Then let's see the creation process of the NFT :
Go to **./back/blockChain/blockChainService.js**
You can adjust the mine function if you want to change the way to secure the transaction or store the metadata, but the most interesting part is the function **createRandomNFT**
Change it and return an object which will be the metadata stored in panata, as you can see there, it's only choose a random class to the NFT but you can do better I guess.

The function **getNftByAddress** will return the list of the NFT of the address provided, you don't have to make any changes on it except you change the way to store the metadatas.

Endpoints: 

- POST **/mine** requires the body object :
	```
	{
		address: "0x....",
		txHash: "0x...."
	}
	```
	The address is the address on which the NFT will be distributed
	The txHash is the hash of the transaction that the minor made to pay the NFT. It will be checked in the mine function. If the transaction is not valid, the NFT will not be awarded 

- POST **/getNftByAddress** requires the body object :
	```
	{
		address: "0x....",
	}
	```
	It will be return all the NFT owned by the address you provided

Now you can start the node server with the command **node app.js**

# 3 Front End

The front part is really simple just go the the **./front/src/constant/config.js** and change the constants. The serverUrl is the server url you launched before and the contractOwnerAddress is the contract owner address that you've created. The only address that can mine and the address that will receive all payment of the NFT.

Now let's go to the **App.js**. All the Metamask configuration is set. It mean that the app will ask you to unlock your Metamask account. It will also reload the NFT list if you switch account on Metamask.

You can change the constant **price** to adjust the price that your NFT cost.

When you click on the mining button, a transaction with the amount you provided will be asked through Metamask. Accept it and when the transaction will be successful, the mine function in the back-end will be called to mine the NFT. After that the NFT list will refresh and you'll be able to see your new NFT 

Now just start the react app with the command **npm start** and enjoy

This is my first project, so this is an experiment, I don't have that much knowledge about security and so on. If you have advices feel free to let me know

