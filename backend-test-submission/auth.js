import axios from "axios";
import { config } from "dotenv";
config();

let accessToken = null;

export async function getAccessToken() {
  const accessCode = process.env.ACCESS_CODE;
  const clientID = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  if (accessToken) {
    return accessToken;
  }

  try {
    const res = await axios.post(
      "http://20.244.56.144/evaluation-service/auth",
      {
        email: "ayush.badola.04@gmail.com",
        name: "ayush badola",
        rollNo: "2218546",
        accessCode,
        clientID,
        clientSecret,
      }
    );
    return res.data.access_token;
  } catch (err) {
    return null;
  }
}
