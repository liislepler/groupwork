<script>
    export default {
        props: {
		user: Object,
        },
        data(){
            return {
                course: {},
                errors: []
            }
        },
        mounted(){
            
            const id = this.$route.params.id
            
            fetch("http://localhost:3000/courses/"+id).then(response => {
                
                if(response.status == 200){
                    
                    response.json().then(course => {
                        this.course = course
                    })
                    
                }else if(response.status == 404){
                    this.errors.push("No ad with the given id")
                }else if(response.status == 500){
                    this.errors.push("Server couldn't carry out request")
                }
                
            })
            
        }
}
</script>

<template>
		<h1>Course</h1>
		
		<div v-if="errors.length == 0">
			<div>Course title: {{course.title}}</div>
			<div>Description: {{course.description}}</div>
            <p>Notes list</p>
		</div>
		
		<div v-else>
			<p>Can't show the notes because:</p>
			<ul>
				<li v-for="error in errors">
					{{error}}
				</li>
			</ul>
		</div>

</template>

<style scoped>

</style>