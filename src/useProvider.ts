import { useEffect, useState } from "react";
import {
  JsonRpcProvider,
  WebSocketProvider,
} from "@ethersproject/providers";
import { ConnectionStatus } from "./types";

import { providers } from "ethers";
import axios from "axios";
import * as qs from "qs";

export const DEFAULT_ERIGON_URL = "http://127.0.0.1:8545";

const TOKEN_REFRESH_URL = "https://sts.choreo.dev/oauth2/token";
const API_KEY = 'Y1lKQmhQREFNV25DeGJpUXRSX1VzOUJDZTJrYToxaDlGQ0FVMTlKVl9lMkljT0xKbUV3MXdYOUlh'

const rpcUrl = 
// 'http://127.0.0.1:8545/'
'https://2ec56128-a23d-40b9-8d27-6fe6ac12db29-dev.e1-us-east-azure.choreoapis.dev/xvol/blockchain-poa-2/restpow2-5f5/1.0.0/'

const getAccessToken = async () => {
  const payload = qs.stringify({
    grant_type: "client_credentials"
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: TOKEN_REFRESH_URL,
    headers: {
      Authorization: `Basic ${API_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: payload
  };

  const response = await axios(config);
  const accessToken = response.data.access_token;
  return accessToken;
  
}

const connection = {
  url: rpcUrl,
  headers: {
    'Authorization': 'Bearer eyJ4NXQiOiJZV1kxTm1Sa1pHSTVNekU0T0RCbFpEUmlNV0k0WldKbE5qRXhaV1ZpWmpFek1tTm1ORFUzWVEiLCJraWQiOiJNV1E1TldVd1lXWmlNbU16WlRJek16ZG1NekJoTVdNNFlqUXlNalZoTldNNE5qaGtNR1JtTnpGbE1HSTNaRGxtWW1Rek5tRXlNemhoWWpCaU5tWmhZd19SUzI1NiIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhNmVkNDcxOS04N2JkLTRmNTEtODc4ZS0xYmNhZDE5ZjJkOTQiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6ImNZSkJoUERBTVduQ3hiaVF0Ul9VczlCQ2Uya2EiLCJuYmYiOjE2ODY3NTk1MDQsImF6cCI6ImNZSkJoUERBTVduQ3hiaVF0Ul9VczlCQ2Uya2EiLCJzY29wZSI6ImRlZmF1bHQiLCJvcmdhbml6YXRpb24iOnsidXVpZCI6IjJlYzU2MTI4LWEyM2QtNDBiOS04ZDI3LTZmZTZhYzEyZGIyOSJ9LCJpc3MiOiJodHRwczpcL1wvc3RzLmNob3Jlby5kZXY6NDQzXC9vYXV0aDJcL3Rva2VuIiwiZXhwIjoxNjg3Mjg1MTA0LCJpYXQiOjE2ODY3NTk1MDQsImp0aSI6IjE3ZWM2MGQ1LWYzNDEtNGY5YS1hNjJhLTc5ZWYwNDgyNTNiZCJ9.Siuw1oB5GKNpL9nnunMLPRsjKR-gKZeV77mlfhHy58ganUz--pT5lbaStIIVul5nVud0Xnhihd2XcqAaGzPCu0wtSYQ43BIr0Ahlr2wzo_Kf8e1r63fd2YkOFZgK0BVIXKVgVy5hgnIO502P7kQFWki2T918f-tiKGmgKa5q5zKCaBw8VS8L-yLPBd_4xo4to2aAAkg8n9zPx8Rg_vRdce6zu4-EDOl687FbnBSxE8cuv7Qn4ao7bGAyHaztZYj7ktOqH4ILJXULHxnb_40JgXM_h8kl4OOspjjqjX1U5A3rnwjupG-UGSQOmOcv9r_obpX3xGaXvplTGnW6ihgAteHNeTiZz4SEcTIiyADp3N03Ma0G9dfyNRb1ZnFL92uZTgVKB4G8HrZv-62fW7KkRoSDIPNAmjvgUV1U36xdB_hHql3tp1HsrULRDgT6-8IS7LKpAL49uBW9R1hhXzYlKdJJlwvifuyIZ8o2RRQ3tTnGFE0VNKhXw9RkLYKr8PuLxjSTkcJqUy90fpQQ7-J0BjieWjLxOhRm566GJRmP-cK14cPMh4AYiGbb78OlxRsElPd6lwf6G3HUQk3uBAMxBF3FzK-muGFTujv6CSN8Ms4QLHNXcZBK-kY1ousi7vwFRtvyb0LuBxir9U0UKFN0Pkh18mrKEabUth9ulWbkyds'
  }
};

const Wso2provider = new providers.JsonRpcProvider(connection);

let ACCESS_TOKEN = '';

// const connection = {
//   url: rpcUrl,
//   headers: {
//     Authorization: ''
//   }
// };


// let Wso2provider: providers.JsonRpcProvider | null = null;

const main = async () => {
  let accessToken = await getAccessToken();
  console.log('ACCESS_TOKEN', accessToken);
  
  
  ACCESS_TOKEN = accessToken;

  // if (ACCESS_TOKEN) {
  //   connection.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  // }
};

main().then(() => {
  console.log('ACCESS_TOKEN outside', ACCESS_TOKEN);
  
  // connection.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  // Wso2provider = new providers.JsonRpcProvider(connection);
  
  // console.log('Wso2provider', Wso2provider);
});

export const useProvider = (
  erigonURL?: string
): [ConnectionStatus, JsonRpcProvider | undefined] => {
  const [connStatus, setConnStatus] = useState<ConnectionStatus>(
    ConnectionStatus.CONNECTING
  );

  if (erigonURL !== undefined) {
    if (erigonURL === "") {
      console.info(`Using default erigon URL: ${DEFAULT_ERIGON_URL}`);
      erigonURL = DEFAULT_ERIGON_URL;
    } else {
      console.log(`Using configured erigon URL: ${erigonURL}`);
    }
  }

  const [provider, setProvider] = useState<JsonRpcProvider | undefined>();

  useEffect(() => {
    if (erigonURL === undefined) {
      setConnStatus(ConnectionStatus.NOT_ETH_NODE);
      setProvider(undefined);
      return;
    }
    setConnStatus(ConnectionStatus.CONNECTING);
  
    const tryToConnect = async () => {
      let provider: JsonRpcProvider | WebSocketProvider;
  
      if (erigonURL?.startsWith("ws://") || erigonURL?.startsWith("wss://")) {
        provider = new WebSocketProvider(erigonURL);
      } else {
        const wso2Provider: any = await Wso2provider; // Await the promise and cast it to 'any'
        provider = wso2Provider as JsonRpcProvider; // Cast 'any' to 'JsonRpcProvider'
      }
  
      // Check if it is at least a regular ETH node
      let blockNumber: number = 0;
      try {
        blockNumber = await provider.getBlockNumber();
        setConnStatus(ConnectionStatus.CONNECTED);
        setProvider(provider);
      } catch (err) {
        console.log(err);
        setConnStatus(ConnectionStatus.NOT_ETH_NODE);
        setProvider(undefined);
        return;
      }
    };
  
    tryToConnect();
  }, [erigonURL]);
  

  return [connStatus, provider];
};

