<template>
    <div >
        <app-timer :current-seconds="-10"></app-timer>
        <transition-group name="flip-list" tag="div" class="card-container mx-auto" appear>
            <app-tile v-for="item in items"
                      :key="item.index"
                      :item="item" @tileClicked="handleClick"></app-tile>
        </transition-group>
    </div>
</template>

<script>
    import Tile from "./Tile";
    import Timer from "./Timer";
    import { eventBus } from "../main";

    export default {
        name: "Game",
        data() {
            return {
                icons: [
                    "fa-angry", "fa-calendar-alt", "fa-comment-dots",
                    "fa-file-code", "fa-eye", "fa-folder-open",
                    "fa-flag",  "fa-gem", "fa-hand-point-up",
                    "fa-kiss-wink-heart", "fa-paper-plane", "fa-trash-alt",
                    "fa-snowflake", "fa-star", "fa-keyboard",
                    "fa-images", "fa-bell", "fa-file-pdf"
                ],
                items: [],
                itemsClicked: [],
                itemsGuessed: [],
                isClickPermitted: false,
                time: {
                    minutes: 0,
                    seconds: 0
                },
                initialDelay: null
            }
        },
        watch: {
            itemsClicked() {
                if (this.sameTilesClicked()) {
                    this.itemsGuessed.push(this.itemsClicked[0]);
                    this.itemsGuessed.push(this.itemsClicked[1]);
                    this.itemsClicked = [];
                }
                // Не давать игре вести себя странно, если нажато больше клеток, чем нужно
                else if (this.itemsClicked.length >= 2) {
                    this.isClickPermitted = false;
                    setTimeout(() => {
                        this.setAllInvisible(this.itemsClicked);
                        this.itemsClicked = [];
                        this.isClickPermitted = true;
                    }, 1000);
                }
            },
            // Проверяет выигрыш
            itemsGuessed() {
                if (this.itemsGuessed.length === 36) {
                    this.$emit('gameOver', this.time)
                }
            }
        },
        methods: {
            startNewGame() {
                this.resetData();
                for (let i = 0; i < 36; i++) {
                    this.items.push({
                        index: i,
                        icon: this.icons[Math.floor(i/2)],
                        visible: true
                    });
                }

                this.items = this.shuffle(this.items);

                this.initialDelay = setTimeout(() => {
                    this.setAllInvisible(this.items);
                    this.isClickPermitted = true;
                }, 11000);
            },

            handleClick(item) {
                if (!this.isClickPermitted || this.itemsGuessed.includes(item)) {
                    return;
                }
                this.itemsClicked.push(item);
                item.visible = true;
            },

            sameTilesClicked() {
                return this.itemsClicked.length === 2 &&
                    this.itemsClicked[0].icon === this.itemsClicked[1].icon &&
                    this.itemsClicked[0].index !== this.itemsClicked[1].index
            },

            shuffle(a) {
                let j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }
                return a;
            },
            setAllInvisible(items) {
                for (let item of items) {
                    item.visible = false
                }
            },
            resetData() {
                this.itemsClicked = [];
                this.itemsGuessed = [];
                this.items = [];
                clearTimeout(this.initialDelay)
            }
        },
        components: {
            appTimer: Timer,
            appTile: Tile
        },
        created() {
            this.startNewGame();
            eventBus.$on('resetAll', () => {
                this.startNewGame()
            }).$on('timerStopped', time => {
                this.time = time;
            })
        }
    }
</script>

<style lang="scss" scoped>
    .card-container {
        display: flex;
        flex-wrap: wrap;
        width: 600px;
        height: 600px;
    }
    @media screen and (max-width: 768px) {
        .card-container {
            height: 450px!important;
            width: 450px!important;
        }
    }
    @media screen and (max-width: 576px) {
        .card-container {
            height: 300px !important;
            width: 300px !important;
        }
    }
</style>