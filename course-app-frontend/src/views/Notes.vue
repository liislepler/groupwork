<script>
	export default {
		data(){
			return {
				notes: [],
				errors: []
			}
		},
		mounted(){
			fetch("http://localhost:3000/notes").then(response => {
				
				if(response.status == 200){
					
					response.json().then(notes => {
						this.notes = notes
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
			<p>Here are all the notes!</p>
			<ul>
				<li v-for="note in notes">
					<RouterLink :to="`/notes/${note.id}`">
						{{note.title}} 
                        {{note.description}}
                        {{note.course}}
                        {{note.accountId}}
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