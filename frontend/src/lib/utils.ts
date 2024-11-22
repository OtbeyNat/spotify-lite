import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { axiosInstance } from "./axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isTokenValid(){
  const accessToken = localStorage.getItem("spotify_access_token");
  // const refreshToken = localStorage.getItem("spotify_refresh_token");
  const expireTime = localStorage.getItem("expire_time");
  
  if(accessToken === null) return false;
  if(expireTime === null || Date.now() > parseInt(expireTime)) {
    return false;
  }
  console.log("Expire",parseInt(expireTime),"Now",Date.now());
  console.log(Date.now() > parseInt(expireTime));
  return true;
}

export const getToken = () => {
  console.log("getToken");
  const scope = 'user-read-email user-top-read user-read-recently-played';
  const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  console.log(client_id);
  const redirect_uri = import.meta.env.MODE === "development" ? `http://localhost:5000/api/spotify/request` : "https://spotify-lite.onrender.com/api/spotify/request";
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}`;
}

export const checkAccessToken = async () => {
  console.log("Check Access Token");
  const accessToken = localStorage.getItem('spotify_access_token');

  if (!isTokenValid()) {
    // either no access token, or access token expired
    if (!accessToken) {
      // no access token
      console.log("No access token");
      getToken()
    } else {
      // access token expired
      console.log("Refresh Token");
      const refreshToken = localStorage.getItem("spotify_refresh_token");  
      console.log(refreshToken);    
      if (refreshToken) {
        // use refresh token
        const response = await axiosInstance.get(`/spotify/refresh/${refreshToken}`)
        // console.log(response.data);
        const {access_token, expires_in, refresh_token} = response.data;
        const expireTime = Date.now() + expires_in * 1000;
        console.log("expireTime",expireTime);
        console.log("access_token",access_token);
        localStorage.setItem("spotify_access_token",access_token);
        localStorage.setItem("expire_time",expireTime.toString());
        if (refresh_token) {
          // received refresh token in response
          console.log("UPDATE REFRESH");
          localStorage.setItem("spotify_refresh_token",refresh_token);
          console.log(refreshToken)
        }
      } else {
        // no access token and no refresh token
        console.log("No access + no refresh token");
        getToken()
      }
    }
  } else {
    // access token is valid
    console.log("Access Token is Valid");
  }
}