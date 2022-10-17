<script>
    export default {
        props: {
            user: Object
        },
        data(){
            return {
                title: "",
                description: "",
                courseHasBeenCreated: false,
                errors: []
            }
        },
        methods: {
            createCourse(){
                
                const course = {
                    title: this.title,
                    description: this.description,
                    accountId: this.user.accountId
                }
                
                fetch("http://localhost:3000/courses", {
                    method: "POST",
                    headers: new Headers({
                        "Authorization": this.user.accessToken,
                        "Content-Type": "application/json"
                    }),
                    body: JSON.stringify(course)
                }).then(response => {
                    
                    if(response.status == 201){
                        this.courseHasBeenCreated = true
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

		<h1>Create Course</h1>
		
		<div v-if="courseHasBeenCreated">
			<p>The course has been created.</p>
		</div>
		
		<div v-else>
			
			<div>
				Course title: <input type="text" v-model="title">
			</div>
			<div>
				Description: <input type="text" v-model="description">
			</div>
			<button @click="createCourse">Create course</button>
			
			<div v-if="0 < errors.length">
				<p>Couldn't create the course, because:</p>
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