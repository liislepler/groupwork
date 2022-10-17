<script>
    export default {
        props: {
            user: Object
        },
        data(){
            return {
                title: "",
                notetext: "",
                course: "",
                noteHasBeenCreated: false,
                errors: [],
                courses: []
            }
        },
        mounted(){
			fetch("http://localhost:3000/courses").then(response => {
				
				if(response.status == 200){
					
					response.json().then(courses => {
						this.courses = courses
					})
					
				}else if(response.status == 500){
					this.errors.push("Server couldn't send back all ads")
				}
				
			})
		},
        methods: {
            createNote(){
                
                const note = {
                    title: this.title,
                    notetext: this.notetext,
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
                        this.noteHasBeenCreated = true
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

		<h1>Create note</h1>
		
		<div v-if="noteHasBeenCreated">
			<p>The note has been created.</p>
		</div>
		
		<div v-else>
			
			<div>
				Title: <input type="text" v-model="title">
			</div>
			<div>
				Your note: <input type="text" v-model="notetext">
			</div>
            <div>
                Course: <select v-model="course">
                    <option disabled value="">Select Course</option>
                    <option v-for="course in courses" :value="course.title">{{ course.title }}</option>
                </select>
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
		

</template>

<style scoped>

</style>
