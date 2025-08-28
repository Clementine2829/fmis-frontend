import axios from "axios";

const port = 3001;
const baseURL = `http://localhost:${port}/api`;


// User-related API calls
export const signup = async (params) => {
    console.log("Signup params:", params);
  return makeRequest(`${baseURL}/users/signup`, "POST", null, params);
};

export const loginUser = async (params) => {
  return makeRequest(`${baseURL}/users/login`, "POST", null, params);
};

export const updateUser = async (userId, accessToken, params) => {
  return makeRequest(`${baseURL}/users/${userId}`, "PUT", accessToken, params);
};

// Farm-related API calls
export const createFarm = async (accessToken, params) => {
  return makeRequest(`${baseURL}/farms`, "POST", accessToken, params);
};

export const updateFarm = async (farmId, accessToken, params) => {
  return makeRequest(`${baseURL}/farms/${farmId}`, "PUT", accessToken, params);
};

export const getUserFarms = async (accessToken) => {
  return makeRequest(`${baseURL}/farms/`, "GET", accessToken);
};

export const deleteFarm = async (farmId, accessToken) => {
  return makeRequest(`${baseURL}/farms/${farmId}`, "DELETE", accessToken);
};

export const getFarmNDVI = async (accessToken, params) => {
  return makeRequest(`${baseURL}/farms/ndvi`, "POST", accessToken, params);
};

export const getNDVIHistory = async (farmId, accessToken) => {
  return makeRequest(`${baseURL}/farms/ndvi/history/${farmId}`, "GET", accessToken);
};

const makeRequest = async (url, method, accessToken, params = {}) => {
  try {
    const response = await axios({
      url,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      data: params,
    //   withCredentials: true,
    });

    if (!response.data) {
      throw new Error("Invalid response");
    }
    return response.data;
  } catch (error) {
    if(error.response?.status === 401){
        const refreshTokened = await refreshAccessToken();
        const newAccessToken = await refreshTokened.accessToken;
        
        makeRequest(url, method, newAccessToken, params);
    }
    console.error("Error:", error);
    throw error;
  }
};

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios({
            url: `${baseURL}/users/refresh`,
            method: "GET",
            // withCredentials: true,
            // headers: {
        });
        const {refreshToken} = response.data;
        return refreshToken;
    } catch (error) {
        if(error.response?.status === 403){
            alert("Refresh token expired or invalid. Please log in again.");
            window.location.href = "/login";
        }
    }
};
