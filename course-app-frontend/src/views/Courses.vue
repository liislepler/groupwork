<script>
	export default {
		props: {
		user: Object,
        },
		data(){
			return {
				courses: [],
				errors: []
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
	}
</script>

<template>
    	<div v-if="errors.length == 0">
			<p>Here are all your courses!</p>
			<ul>
				<li v-for="course in courses">
					<RouterLink :to="`/courses/${course.id}`">
						{{course.title}} 
					</RouterLink>
				</li>
			</ul>
		</div>

        <ul>
            <li v-for="error in errors">
                {{error}}
            </li>
		</ul>
</template>

<style scoped>

</style>