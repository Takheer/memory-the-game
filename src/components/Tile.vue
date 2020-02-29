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