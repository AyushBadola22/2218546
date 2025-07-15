import axios from "axios";
import { getAccessToken } from "../backend-test-submission/auth.js";
export default async function Log(stack, level, pkg, message) {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Token was not found");
    }
    const response = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      success: true,
      ...response.data,
      error : response.data.error ?? "No error "
    };
  } catch (error) {
    const message =
      "LOG FAILLED and console logs are not allowed in any case in this project";
    return {
      success: false,
      message,
      error: error.message ?? "Some error ",
    };
  }
}
