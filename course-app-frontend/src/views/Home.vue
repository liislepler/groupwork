<script>
    export default {
        props: {
            user: Object
        },
        data(){
            return {

            }
        }
    }
</script>

<template>

    <nav v-if="user.isSignedIn">
        <ul>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/notes">Notes</RouterLink></li>
            <li><RouterLink to="/courses">Courses</RouterLink></li>
            <li><RouterLink to="/create-note">Create Note</RouterLink></li>
            <li><RouterLink to="/create-course">Create Course</RouterLink></li>
        </ul>
    </nav>

</template>

<style scoped>
    ul {
        display: flex;
        flex-direction: column;
    }
    a {
        text-decoration: none;
        color: black;
    }
</style>