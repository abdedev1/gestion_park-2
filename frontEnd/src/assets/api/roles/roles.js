import {axios} from "../axios";


export const getRoles = async () => {
    const res = await axios.get("roles")
    return res.data
}