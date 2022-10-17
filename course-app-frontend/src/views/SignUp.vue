<script>
    export default {
        data(){
            return {
                account: {
                    username: "",
                    password: "",
                },
                accountHasBeenCreated: false,
                errors: []
            }
        },
        methods: {
            createAccount(){
                
                fetch("http://localhost:3000/accounts", {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json"
                    }),
                    body: JSON.stringify(this.account)
                }).then(response => {
                    
                    if(response.status == 201){
                        this.accountHasBeenCreated = true
                    }else if(response.status == 400){
                        
                        response.json().then(errors => {
                            this.errors = errors
                        })
                        
                    }else if(response.status == 500){
                        this.errors.push("Server is not working as it should")
                    }
                    
                })
                
            }
        }
}
</script>

<template>

		<h1>Create account</h1>
		
		<div v-if="accountHasBeenCreated">
			<p>The account has been created.</p>
		</div>
		
		<div v-else>
			
			<div>
				Username: <input type="text" v-model="account.username">
			</div>
			<div>
				Password: <input type="password" v-model="account.password">
			</div>
			<button @click="createAccount">Create account</button>
			
			<div v-if="0 < errors.length">
				<p>Couldn't create the account, because:</p>
				<ul>
					<li v-for="error in errors">
						{{error}}
					</li>
				</ul>
			</div>
			
		</div>
		
</template>

<style scoped>


</style>
