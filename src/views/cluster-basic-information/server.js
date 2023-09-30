import axios from "axios"
export function getModelList() {
  return axios.get("/getdata").then((res) => res.data)
}
