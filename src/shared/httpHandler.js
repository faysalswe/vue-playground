import axios from "axios";
import { BASE_API_URL } from "../constants/ApiUrl";

export const getData = url => {
  return axios({
    url,
    method: "GET"
  });
};

function getToken() {
  return "";
}

export const postData = (url, data) => {
  return axios({
    url,
    method: "POST",
    data: JSON.stringify(data)
  });
};

export const putData = (url, data) => {
  return axios({
    url,
    method: "PUT",
    data: JSON.stringify(data)
  });
};

axios.interceptors.request.use(function(request) {
  request.baseURL = BASE_API_URL;
  request.headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${getToken()}`
  };
  // console.log("request", request);
  return request;
});

axios.interceptors.response.use(
  function(response) {
    // console.log("response", response);
    return response.data;
  },
  function(error) {
    let detail = "Sorry! Something went wrong.";

    if (error.response && error.response.data && error.response.data.detail) {
      detail = error.response.data.detail;
    }
    return Promise.reject(detail);
  }
);
