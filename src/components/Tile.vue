<template>
    <div class="icon-card" @click="clicked">
        <transition name="fade" appear>
            <i class="far" :class="item.icon" v-if="item.visible"></i>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "Tile",
        data() {
            return {
                isGuessed: false
            }
        },
        props: {
            item: Object
        },
        methods: {
            clicked() {
                this.$emit('tileClicked', this.item);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .icon-card {
        cursor: pointer;
        display: inline-flex;
        border: 1px solid rgba(0,0,0, 0.25);
        width: 100px;
        height: 100px;
        i {
            margin: auto;
            font-size: 70px;
        }
    }

    .fade {
        &-enter {
            opacity: 0!important;
            &-active {
                transition: opacity .2s;
                opacity: 1;
            }
        }

        &-leave {
            &-active {
                transition: opacity .2s;
                opacity: 0;
            }
        }
    }
</style>