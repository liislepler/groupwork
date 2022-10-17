<script>
    export default {
            props: {
                user: Object
            },
            data(){
                return {
                    message: ""
                }
            },
            mounted() {
                this.user.isSignedIn = false
                this.user.username = ""
                this.user.password = ""
                this.message = "You are signed out, see you again soon!"
                console.log("signed out")
                // The SDK has now forgot which account you previously signed in to.
            }
        }
        
</script>

<template>
    <h2 v-if="message != ''">{{message}}</h2>
</template>

<style scoped>


</style>