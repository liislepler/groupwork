<script>
    export default {
        props: {
            user: Object
        },
        data(){
            return {
                title: "",
                description: "",
                course: "",
                noteHasBeenCreated: false,
                errors: []
            }
        },
        methods: {
            createNote(){
                
                const note = {
                    title: this.type,
                    description: this.weight,
                    course: this.course,
                    accountId: this.user.accountId
                }
                
                fetch("http://localhost:3000/notes", {
                    method: "POST",
                    headers: new Headers({
                        "Authorization": this.user.accessToken,
                        "Content-Type": "application/json"
                    }),
                    body: JSON.stringify(note)
                }).then(response => {
                    
                    if(response.status == 201){
                        this.adHasBeenCreated = true
                    }else if(response.status == 400){
                        
                        response.json().then(errors => {
                            this.errors = errors
                        })
                        
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
	<div class="page">
		<h1>Create note</h1>
		
		<div v-if="noteHasBeenCreated">
			<p>The note has been created.</p>
		</div>
		
		<div v-else>
			
			<div>
				Title: <input type="text" v-model="title">
			</div>
			<div>
				Description: <input type="text" v-model="description">
			</div>
            <div>
				Course: <input type="text" v-model="course">
			</div>
			<button @click="createNote">Create note</button>
			
			<div v-if="0 < errors.length">
				<p>Couldn't create the note, because:</p>
				<ul>
					<li v-for="error in errors">
						{{error}}
					</li>
				</ul>
			</div>
			
		</div>
		
	</div>
</template>

<style scoped>

.page{
	background-color: lime;
}

</style>
