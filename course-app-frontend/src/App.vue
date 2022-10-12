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
                    <li><RouterLink to="/notes">Notes</RouterLink></li>
                    <li><RouterLink to="/create-note">Create Note</RouterLink></li>
                </ul>
            </nav>

            <main>
                <RouterView :user="user"></RouterView>
            </main>
        </div>
    </div>
</template>

<style>

    body {
        margin: 0 auto;
        width: 400px;
        background-color: rgb(245, 238, 229);
    }
    .page { 
        background-color: white;
        min-height: 680px;
        height: 100%;
        margin-top: 20px;
    }

</style>
