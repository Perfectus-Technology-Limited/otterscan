import { useEffect, useState } from "react";
import {
  JsonRpcProvider,
  JsonRpcBatchProvider,
  WebSocketProvider,
} from "@ethersproject/providers";
import { ConnectionStatus } from "./types";
import { MIN_API_LEVEL } from "./params";

import { providers } from "ethers";

export const DEFAULT_ERIGON_URL = "http://127.0.0.1:8545";

const rpcUrl = 'http://127.0.0.1:8545/'
  // "https://2ec56128-a23d-40b9-8d27-6fe6ac12db29-dev.e1-us-east-azure.choreoapis.dev/xvol/blockchain-poa-2/restpow2-5f5/1.0.0/";
const connection = {
  url: rpcUrl,
  headers: {
    "API-Key":
      "eyJraWQiOiJnYXRld2F5X2NlcnRpZmljYXRlX2FsaWFzIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4ZWM5YWJjYi03ZmU1LTQ0M2YtYmZlNy1jMDJkZDI0MmMyY2NAY2FyYm9uLnN1cGVyIiwiaXNzIjoiaHR0cHM6XC9cL3N0cy5jaG9yZW8uZGV2OjQ0M1wvb2F1dGgyXC90b2tlbiIsImtleXR5cGUiOiJQUk9EVUNUSU9OIiwic3Vic2NyaWJlZEFQSXMiOlt7InN1YnNjcmliZXJUZW5hbnREb21haW4iOm51bGwsIm5hbWUiOiJCbG9ja2NoYWluIFBPQSAyIC0gcmVzdHBvdzIgNWY1IiwiY29udGV4dCI6IlwvMmVjNTYxMjgtYTIzZC00MGI5LThkMjctNmZlNmFjMTJkYjI5XC94dm9sXC9ibG9ja2NoYWluLXBvYS0yXC9yZXN0cG93Mi01ZjVcLzEuMC4wIiwicHVibGlzaGVyIjoiY2hvcmVvX3Byb2RfYXBpbV9hZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOm51bGx9XSwiZXhwIjoxNjg2NjMyMDI3LCJ0b2tlbl90eXBlIjoiSW50ZXJuYWxLZXkiLCJpYXQiOjE2ODY2MzE0MjcsImp0aSI6ImQ4OGJiOWIxLTE4NGUtNDBlYS04NzgzLTAzYzBkYzNhNjZkMyJ9.TmqZbJp3qJwgyQL0Jr0-P4JQm0Ecjzpav0lrG9yVDQ7IC0fWv_Yj7MaBe4Vhc7TCfGRFVv6TzaaVfBrbRF0HohbtdxH_ozyse5QFj7trqhQTu0SG6h3OEGL_qtAgn32wilQCzTfzXR7RRNiM3QxvJECEMA4RGCyYDSfO0261Hjk0BG7Qow4WPO2OuuDWZUmESjvH8a7Hicu8WIXa1iDV9tddZ5ro-nkDJz84H4D-sGdHbFIJZOzrY156g-jHVuOaq9kK9PkjYz0iNfeqVZgF7RqUg8zhC8lQUdvIoHpiVjuSZLPg_ggg0HZmVEr9wkcKhuK5Li0-7XL-YNpuq9Xqx4QytvMEwZui65fpZ2vFw811MA75D60gIQyPHqVFBXWCjqbIOgASL_S284GouZQ1WV_2BeUgk_VtZ6mCfDq52fRq43uybXhXSyxcuDl13zs15tfyG-S79VPWwuHaOAsq8ova8Q5yS74hAq8FNLdME5sSXG2QcQ9uLYFrCzuVfYz8_ANAlK-brh1GoHp4O3_VBoF8NjR52iZK6ZBIQ_jtlb9MnDO1Mb4ENCFlrTVMyA1Py3IgZuUp5dsNJycAZ5xE70LgG0COWBbZwH6QTYoi4tsKL1-Ujcqml77Bh8f9TeQpyaXOTphKjnr_dF5yJkU-QK08_UHepE9I8aNYkp_w4Fs"
  }
};

const Wso2provider = new providers.JsonRpcProvider(connection);

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
      let provider: JsonRpcProvider;
      if (erigonURL?.startsWith("ws://") || erigonURL?.startsWith("wss://")) {
        provider = new WebSocketProvider(erigonURL);
      } else {
        provider = Wso2provider;
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
