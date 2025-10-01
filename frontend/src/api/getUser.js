//get current api
import api from "@/utils/axiousInstance"
export const getCurrentUser = async ()=>{
    const data = await  api.get("api/auth/me")
    return data
}


export const getUserUrls = async () =>{

    const data = await api.get("api/url/")

    return data 

}