import { isAxiosError } from "axios"
import { axios, setBearerToken } from "../axios"
import Cookies from "js-cookie"



export default class Auth {


    static async Register(info) {

        let data = {
            success: true,
            message: "",
            errors: {},
        }

        try {
            const res = await axios.post("register", info)
            data = res.data
            setBearerToken(data.token)
            Cookies.set("token", data.token, {expires: data.expires, secure: true})

            return data

        } catch (error) {
            data.success = false
            if(isAxiosError(error)) {
                if(error.status == 422) {
                    data.errors = error.response.data.errors
                    data.message = error.response.data.message
                    return data
                }
                return data
            }
            data.message = "Something went wrong"
            return data
        }
    }

  
    
}