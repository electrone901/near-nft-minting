import "regenerator-runtime/runtime";
import React, { useState } from "react";
import { login, logout } from "./utils";
import "./global.css";
import getConfig from "./config";
// import { NFTStorage, File } from "nft.storage";
import axios from "axios";
import { nanoid } from "nanoid";

const { networkId } = getConfig(process.env.NODE_ENV || "development");

const nftStorageToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEIyMTFiRjY2NTNjZTcyODEyZGI3MjRGMDkwODUzODM1QjBGOTE0MUUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNzY0NDQzODQ0NSwibmFtZSI6InF1aWxsIn0.zCASQI4jOjLG98tCmI1TkJkJbHGyOS-BNClgQ8jwN2M";

const getImageBlob = async (imageInput) => {
  return new Promise((res, rej) => {
    try {
      const fileReader = new FileReader();
      fileReader.onloadend = () => res(fileReader.result);
      fileReader.readAsArrayBuffer(imageInput.files[0]);
    } catch (e) {
      res(null);
    }
  });
};

const Login = () => {
  return (
    <main>
      <h1>NEARVEMBER CHALLENGE 05!</h1>


      <p style={{ textAlign: "center", marginTop: "2.5em" }}>
        <button onClick={login}>Sign in</button>
      </p>
    </main>
  );
};

const App = () => {
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    const { titleInput, imageInput } = e.target.elements;

    // const title = titleInput.value.trim();
    const title = "Bitcoin NFT";

    // const image = await getImageBlob(imageInput);
    // if (!title || !image) {
    //   setError("Title and Image should be provided!");
    //   return;
    // } else {
    //   setError(null);
    // }

    // const rep = await axios.post("https://api.nft.storage/upload", image, {
    //   headers: { Authorization: `Bearer ${nftStorageToken}` },
    // });

    // if (rep.data.ok !== true) {
    //   console.error(rep.data);
    //   return;
    // }

    // const media = `https://${rep.data.value.cid}.ipfs.dweb.link/`;
    const media = `https://bafkreib3zx5o2wl4tus4z52jme7lvy2eme7fr56yyxefcfs7er3johpnqe.ipfs.dweb.link/`;


    window.contract
      .nft_mint(
        {
          receiver_id: window.accountId,
          token_id: nanoid(),
          token_metadata: { title, media, copies: 1 },
        },
        "100000000000000",
        "10000000000000000000000"
      )
      .then((res) => {
        console.log(res);
        setNotification(true);
      });
  };

  if (!window.walletConnection.isSignedIn()) return <Login />;

  return (
    <div>
      {notification && <Notification />}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        Hi,&nbsp;
        <span style={{ fontWeight: "bold" }}>{window.accountId}</span>!
        <button className="link" onClick={logout}>
          Sign out
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <form onSubmit={onSubmit}>
          <h1>Mint This BitCoin NFT!</h1>
          {error && (
            <p
              style={{
                backgroundColor: "rgba(255, 0, 0, 0.3)",
                textAlign: "center",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              {error}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <img style={{ height: 150, width: 150 }} src={"https://cdn.pixabay.com/photo/2018/02/02/13/51/bitcoin-3125488__480.png"}></img>
          </div>


          <table>
            <tbody>
              <tr>
                {/* <td>
                  <label htmlFor="titleInput" style={{ marginRight: "10px" }}>
                    NFT Title:
                  </label>
                </td>
                <td>
                  <input type="text" id="titleInput" placeholder="" />
                </td> */}
              </tr>
              <tr>
                {/* <td>
                  <label htmlFor="imageInput" style={{ marginRight: "10px" }}>
                    Select an image:
                  </label>
                </td>
                <td>
                  <input type="file" id="imageInput" />
                </td> */}
              </tr>
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button type="submit">Mint NFT</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;

function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
  return (
    <aside>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.accountId}`}
      >
        {window.accountId}
      </a>
      &nbsp;minted NFT in contract:&nbsp;
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.contract.contractId}`}
      >
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  );
}
