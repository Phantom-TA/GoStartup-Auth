class ApiClient {
    constructor() {
        this.baseUrl = `${process.env.SERVER_URI}/api`,
        this.defaultHeaders ={
            'Content-type' :'application/json',
            'Accept':'application/json'
        };
    }

    async customFetch(endpoint , options ={}){
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const headers = { ...this.defaultHeaders , ...options.headers};

            const config={
                ...options,
                headers,
                credentials: 'include'
            };
            console.log(`Fetching URL : ${url}`)
            const response = await fetch(url,config)
            if(response.status === 401){
                const refreshResponse = await fetch(`${this.baseUrl}/refresh`,{
                    method:'POST',
                    credentials:'include'
            })

            if(refreshResponse.ok){
                const retry = await fetch(url,config)
                return await retry.json()
            }
            
            else{
                throw new Error('Session expired')
            }  
        }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API error:' ,error)
            throw error;
        }
    }

    async login(email,password){
        return this.customFetch('/login',{
            method : 'POST',
            body : JSON.stringify({email,password}),
        })
    }
    async signup(name , email , password){
        return this.customFetch('/register',{
            method:'POST',
            body: JSON.stringify({name,email,password})
        })
    }
    async logout(){
        return this.customFetch('/logout' , {
            method:'GET'

        })
    }
    async getUser(){
        return this.customFetch('/me')
    }
}

const apiClient = new ApiClient();
export default apiClient
