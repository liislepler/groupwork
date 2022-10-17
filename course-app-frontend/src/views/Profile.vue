<script>
    export default {
        props: {
		user: Object,
        },
        data(){
            return {
                courses: [],
                notes: [],
                errors: []
            }
        },
        mounted(){
            
            fetch("http://localhost:3000/courses?accountId=" + this.user.accountId).then(response => {
                
                if(response.status == 200){
                    
                    response.json().then(courses => {
                        this.courses = courses
                    })
                    
                }else if(response.status == 404){
                    this.errors.push("No courses")
                }else if(response.status == 500){
                    this.errors.push("Server couldn't carry out request")
                }
                
            })
            
        }
}
</script>

<template>

    <button class="signout"><RouterLink to="/sign-out">Sign Out</RouterLink></button>

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

</template>

<style scoped>

</style>