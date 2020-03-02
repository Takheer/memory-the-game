<template>
    <div>
        <div class="spinner-border text-secondary" role="status" v-if="!scoresReady">
            <span class="sr-only">Loading...</span>
        </div>
        <ul v-else>
            <li class="lead" :key="score.name" v-for="score in scores">
                {{ score.id }} - {{ Math.floor(score.time / 60) }}:{{ prettifyNumber(score.time % 60) }}
            </li>
        </ul>
    </div>
</template>

<script>
    import { db } from "../db";
    import { prettifyTime } from "../timeHelper";

    export default {
        name: "ScoreTable",
        data() {
            return {
                scores: [],
                scoresReady: false
            }
        },
        props: {
            limit: {
                type: Number,
                default: 5
            },
            showPlayer: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            prettifyNumber(value) {
                return prettifyTime(value)
            }
        },
        mounted() {
            this.$bind('scores', db.collection("scores")
                .orderBy("time", "asc")
                .limit(this.limit))
                .then(() => {
                    this.scoresReady = true;
                })
                .catch((error) => {
                    console.log('error in loading: ', error);
                })
        }
    }
</script>

<style scoped>

</style>