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
    	<div v-if="errors.length == 0">
		    <h1>{{course.title}}</h1>
			<div>{{course.description}}</div>
            <h3>Notes list</h3>
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