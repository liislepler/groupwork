<script>
    export default {
        data(){
            return {
                user: {
                    isSignedIn: false,
                    accessToken: "",
                    username: "",
                    accountId: 0,
			}
            }
        }
    }
</script>

<template>
    <div class="page">
        <div class="user">
                <div v-if="user.isSignedIn">
                    <button class="menu"><RouterLink to="/">Menu</RouterLink></button>
                    <button class="profile"><RouterLink :to="`${user.username}`">{{user.username}}</RouterLink></button>
                </div>
                <div v-else>
                    <div>
                        <button class="signup"><RouterLink to="/sign-up">Sign Up</RouterLink></button>
                        <button class="signin"><RouterLink to="/sign-in">Sign In</RouterLink></button>
                    </div>
                </div>
        </div>

            <main>
                <RouterView :user="user"></RouterView>
            </main>
    </div>
</template>

<style>

    body {
        margin: 0 auto;
        width: 400px;
        min-height:700px;
        background-color: rgb(255, 249, 237);
    }
    .page { 
        background-color: rgb(248, 231, 198);
        min-height: 680px;
        height: 100%;
        margin-top: 20px;
        border-radius: 20px;
    }
    li {
        list-style: none;
    }
    a {
        color: black;
        text-decoration: none;
    }

</style>
