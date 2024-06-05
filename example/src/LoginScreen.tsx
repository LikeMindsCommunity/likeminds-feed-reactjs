import { Button, Dialog, TextField } from "@mui/material";
import { Dispatch } from "react";
interface LoginScreenProps {
  accessToken: string;
  refreshToken: string;
  setAccessToken: Dispatch<string>;
  setRefreshToken: Dispatch<string>;
  apiKey: string;
  setApiKey: Dispatch<string>;
  uuid: string;
  setUUID: Dispatch<string>;
  username: string;
  setUsername: Dispatch<string>;
  login: () => void;
}
const LoginScreen = ({
  accessToken,
  refreshToken,
  setAccessToken,
  setRefreshToken,
  login,
  apiKey,
  setApiKey,
  uuid,
  setUUID,
  username,
  setUsername,
}: LoginScreenProps) => {
  return (
    <div>
      <Dialog open={true}>
        <div
          style={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",

            width: "400px",
          }}
        >
          <div
            className="image-logo"
            style={{
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            <img
              style={{
                height: "100px",
                width: "100px",
                borderRadius: "50%",
              }}
              src="https://media.licdn.com/dms/image/C4D0BAQGKA68Slb3fKg/company-logo_200_200/0/1630546700959/likemindscommunity_logo?e=1724284800&v=beta&t=qQbCxiZp6c3LGk2v38CPSqzWAfGRgiY9pShdaUdRzd0"
              alt="logo"
            />
          </div>
          <h4
            style={{
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            LOGIN TO YOUR LIKEMINDS FEED
          </h4>
          <TextField
            variant="outlined"
            value={accessToken}
            placeholder="Enter your access token"
            onChange={(e) => {
              setAccessToken(e.target.value);
            }}
            sx={{
              marginBottom: "12px",
            }}
          />
          <TextField
            variant="outlined"
            value={refreshToken}
            placeholder="Enter your refresh token"
            onChange={(e) => {
              setRefreshToken(e.target.value);
            }}
            sx={{
              marginBottom: "12px",
            }}
          />
          <TextField
            variant="outlined"
            value={uuid}
            placeholder="Enter your UUID"
            onChange={(e) => {
              setUUID(e.target.value);
            }}
            sx={{
              marginBottom: "12px",
            }}
          />
          <TextField
            variant="outlined"
            value={username}
            placeholder="Enter your Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            sx={{
              marginBottom: "12px",
            }}
          />
          <TextField
            variant="outlined"
            value={apiKey}
            placeholder="Enter your API Key"
            onChange={(e) => {
              setApiKey(e.target.value);
            }}
            sx={{
              marginBottom: "12px",
            }}
          />
          <Button fullWidth onClick={login} variant="contained">
            LOGIN
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default LoginScreen;
