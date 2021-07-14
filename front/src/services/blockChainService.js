import axios from "axios"
import { serverUrl } from "../constants/config"
import elementPhoto from "../constants/elementPhoto.js"

export const fetchNFTs = async (address) => {
    const res = await axios.post(serverUrl + "getNftByAddress", {
        address
    })
    if(Array.isArray(res.data)){
        let result = res.data
        result.forEach(el => {
            el.img = elementPhoto[el.class]
        })
        return result
    }
    return []
}

export const mine = async (address, txHash) => {
    const res = await axios.post(serverUrl + "mine", {
        address,
        txHash
    })
    return res
}