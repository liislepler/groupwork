<script>
    export default {
        props: {
		user: Object,
        },
        data(){
            return {
                note: {},
                errors: []
            }
        },
        mounted(){
            
            const id = this.$route.params.id
            
            fetch("http://localhost:3000/notes/"+id).then(response => {
                
                if(response.status == 200){
                    
                    response.json().then(note => {
                        this.note = note
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
	<div class="page">
		<h1>Note</h1>
		
		<div v-if="errors.length == 0">
			<div>Title: {{note.id}}</div>
			<div>Note: {{note.notetext}}</div>
			<div>Course: {{note.course}}</div>
		</div>
		
		<div v-else>
			<p>Can't show the notes because:</p>
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