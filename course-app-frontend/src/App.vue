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
                    <p><b>{{user.username}}</b>
                    <br>
                    Account ID: <b>{{user.accountId}}</b></p>
                    <button class="signout"><RouterLink to="/sign-out">Sign Out</RouterLink></button>
                </div>
                <div v-else>
                    <div>
                        <button class="signup"><RouterLink to="/sign-up">Sign Up</RouterLink></button>
                        <button class="signin"><RouterLink to="/sign-in">Sign In</RouterLink></button>
                    </div>
                </div>
        </div>

        <div class="page-container">
            <nav>
                <ul>
                    <li><RouterLink to="/">Home</RouterLink></li>
                </ul>
            </nav>

            <main>
                <RouterView :user="user"></RouterView>
            </main>
        </div>
    </div>
</template>

<style>

</style>
