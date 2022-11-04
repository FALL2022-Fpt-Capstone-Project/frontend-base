import axios from "axios";

export default axios.create({
  baseURL: "https://proxyfetobe.herokuapp.com/https://rms-release-api.herokuapp.com/v1/api/",
});
