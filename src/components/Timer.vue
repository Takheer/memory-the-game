<template>
    <div>
        <p class="text-center" :class="{'text-green': seconds >= 0, 'text-red': seconds < 0}">
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
    import { prettifyTime } from "../timeHelper";

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
            console.log('timer stopped and event emitted');
            eventBus.$emit('timerStopped', {
                minutes: this.minutes,
                seconds: this.seconds
            });
        },
        methods: {
            startTimer() {
                this.stopTimer();
                this.currentSeconds = -10;
                this.timer = setInterval(() => {
                    this.currentSeconds++;
                }, 1000)
            },
            stopTimer() {
                clearTimeout(this.timer);
            },
            prettifyNumber(value) {
                return prettifyTime(value);
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
    .text-red {
        color: lightcoral;
    }
    .text-green {
        color: olivedrab;
    }
</style>