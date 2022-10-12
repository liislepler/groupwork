<script>
    import jwtDecode from 'jwt-decode'

    export default {
        props: {
		user: Object,
        },
        data(){
            // Add "username" and "password" to the model,
            // so we can bind what the user types in the
            // <input> elements to these.
            return {
                username: "",
                password: "",
            }
        },
        methods: {
            handleSubmission(){
                
                const credentials = {
                    username: this.username,
                    password: this.password
                }
                
                fetch("http://localhost:3000/tokens", {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json"
                    }),
                    body: JSON.stringify(credentials)
                }).then(response => {
                    
                    if(response.status == 200){
                        
                        response.json().then(body => {
                            
                            this.user.isLoggedIn = true
                            this.user.accessToken = body.accessToken
                            
                            const info = jwtDecode(body.idToken)
                            
                            this.user.accountId = info.accountId
                            this.user.username = info.username
                            
                        })

                        console.log("signed in")
                        this.user.isSignedIn = true
                        
                    }else if(response.status == 401){
                        this.errors.push("Not authorized!")
                    }else if(response.status == 500){
                        this.errors.push("Server is not working as it should")
                    }
                    
                })
                
            }
        }
    }
</script>

<template>
    <div class="container">
        <h1>Sign In</h1>

        <div>
			Username: <input type="text" v-model="username">
		</div>
		<div>
			Password: <input type="password" v-model="password">
		</div>
		<button @click="handleSubmission">Sign In</button>
    </div>
</template>

<style scoped>
    form {
        display: flex;
        flex-direction: column;
    }
    button {
        width: 100px;
        height: 35px;
        border-radius: 10px;
    }

</style>