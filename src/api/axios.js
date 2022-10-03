import axios from "axios";

export default axios.create({
  baseURL: "https://rms-cors-proxy.herokuapp.com/https://rms-staging-env.herokuapp.com/api/",
});
