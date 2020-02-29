<template>
    <div>
        <p class="text-center">
            <template v-if="seconds < 0">
                - 00:{{ prettifyNumber(seconds) }}
            </template>
            <template v-else>
                {{ prettifyNumber(minutes) }}:{{ prettifyNumber(seconds) }}
            </template>
        </p>
    </div>
</template>

<script>
    import { eventBus } from "../main";

    export default {
        name: "Timer",
        data() {
            return {
                timer: null,
                currentSeconds: -10
            }
        },
        computed: {
            minutes() {
                return Math.floor(this.currentSeconds / 60)
            },
            seconds() {
                return this.currentSeconds % 60
            }
        },
        mounted() {
            this.startTimer();
        },
        destroyed() {
            this.stopTimer();
            this.$emit('timerStopped', this.minutes, this.seconds);
        },
        methods: {
            startTimer() {
                this.stopTimer()
                this.currentSeconds = -10;
                this.timer = setInterval(() => {
                    this.currentSeconds++;
                }, 1000)
            },
            stopTimer() {
                clearTimeout(this.timer);
            },

            prettifyNumber(value) {
                value = Math.abs(value)
                if (value < 10) {
                    return "0" + value
                } else {
                    return value
                }
            }
        },
        created() {
            eventBus.$on('resetAll', () => {
                this.startTimer()
            })
        }
    }
</script>

<style lang="scss" scoped>
p {
    font-family: monospace;
    font-size: 5vh;
}
</style>