import { isAxiosError } from "axios"
import { axios, setBearerToken } from "../axios"
import Cookies from "js-cookie"



export default class Auth {


    static async Register(info) {
        let data = {
            success: false,
            message: "Server Error",
            errors: {password: "Something went wrong"}
        }

        try {
            const res = await axios.post("register", info)
            data = res.data
            setBearerToken(data.token)
            Cookies.set("token", data.token, {expires: data.expires, secure: true})
            return data

        } catch (error) {
            if(isAxiosError(error)) {
                if(error.status == 422) {
                    data.errors = error.response.data.errors
                    data.message = error.response.data.message
                    return data
                }
                return data
            }
            return data
        }
    }

    static async Login(info) {
        let data = {
            success: false,
            message: "Server Error",
            errors: {password: "Something went wrong"}
        }

        try {
            const res = await axios.post("login", info)
            data = res.data
            setBearerToken(data.token)
            Cookies.set("token", data.token, {expires: data.expires, secure: true})
            return data

        } catch (error) {
            if(isAxiosError(error)) {
                if(error.status == 400 || error.status == 422) {
                    data.errors = error.response.data.errors
                    data.message = error.response.data.message
                    return data
                }
                return data
            }
            return data
        }
    }
    static async Logout() {
        try {
            const res = await axios.post("logout")
            
            Cookies.remove("token")
            setBearerToken(null)
            return res.data
            
        } catch (error) {
            const data = { success: false, message: "Something went wrong", errors: {password: "Something went wrong"} }
            return data
        }
    }
    

    static async GetUser() {
        let data = {
            success: false,
            message: "Server Error"
        }

        try {
            const res = await axios.get("user")
            data = res.data
            return data
        
        } catch (error) {
            return data
        }
    }
    
}