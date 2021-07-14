import React, {useEffect, useState} from "react"
import './App.css';
import Web3 from "web3"
import { fetchNFTs, mine } from "./services/blockChainService";
import { Grid, Button } from "@material-ui/core";
import CustomAppBar from "./components/AppBar/CustomAppBar";
import NftCard from "./components/Card/NftCard";
import { contractOwnerAddress } from "constants/config";

function App() {

  const [account, setAccount] = useState(null)
  const [nftData, setNftData] = useState([])
  const price = "0.5"

  const loadWeb3 = async () => {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert("Metamask not installed")
    }
  }

  const handleMine = async() => {
    const ammount = window.web3.utils.toWei(price, "ether")
    await window.web3.eth.sendTransaction({
      to: contractOwnerAddress,
      from: account,
      value: ammount
    }, async(error, result) => {
      if(!error){
        await mine(account, result)
        loadNFT()
      }
    })
  }

  const loadBlockChainData = async() => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
  }

  const loadNFT = async () => {
    const res = await fetchNFTs(account)
    setNftData(res)
  }

  window.ethereum.on('accountsChanged', function (accounts) {
    setAccount(accounts[0])
  })

  useEffect(() => {
    loadWeb3()
    loadBlockChainData()
  }, [])

  useEffect(() => {
    if(account !== null){
      loadNFT()
    }
  }, [account])


  return (
    <Grid container>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <CustomAppBar account={account} />
        </Grid>

        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} align="right">
            <Button variant="contained" color="primary" style={{marginRight: "5%", marginTop: "2%"}} onClick={handleMine}>{`Mine for ${price} ETH`}</Button>
        </Grid>

        <Grid container style={{margin: "5%"}}>
            {nftData.map(el => (
            <Grid item xl={4} lg={4} md={4} sm={4} xs={4} style={{padding: "2%"}}>
              <NftCard data={el} />
            </Grid>
          ))}
        </Grid>
    </Grid>
  );
}

export default App;
