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
        height: 100px;
        width: 100px;
        border: 1px solid rgba(0,0,0, 0.25);
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
    @media screen and (max-width: 768px) {
        .icon-card {
            height: 75px;
            width: 75px;
            i {
                font-size: 53px!important;
            }
        }
    }
    @media screen and (max-width: 576px) {
        .icon-card {
            height: 50px;
            width: 50px;
            i {
                font-size: 35px!important;
            }
        }
    }
</style>