<template>
  <div class="container">
    <h1 class="display-4 mb-4">Memory. The Game</h1>
    <span>
      <button class="btn btn-primary" @click="startNewGame">Новая игра</button>
    </span>
    <transition name="fade" mode="out-in" appear>
      <p v-if="!isGameStarted && !isPlayerWon">
        После начала игры у вас будет 10 секунд, чтобы запомнить все клетки. Потом надо отгадать
      </p>
      <div v-else-if="isGameStarted && !isPlayerWon">
        <app-timer :current-seconds="-10" @timerStopped="onTimerStop"></app-timer>
        <transition-group name="flip-list" tag="div" class="card-container mx-auto" appear>
          <app-tile v-for="item in items"
                    :key="item.index"
                    :item="item" @tileClicked="handleClick"></app-tile>
        </transition-group>
      </div>
      <p v-else-if="isPlayerWon" class="mt-5">
        Вы выиграли! Однажды тут появится время ({{ time.minutes }}:{{ time.seconds }}), за которое вы выиграли
      </p>
    </transition>
  </div>
</template>

<script>
import Tile from "./components/Tile";
import Timer from "./components/Timer";
import { eventBus } from "./main";

export default {
  name: 'App',
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
      isGameStarted: false,
      isPlayerWon: false,
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
      // Не давать игре вести себя ебано, если нажато больше клеток, чем нужно
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
        this.isPlayerWon = true;
        this.isGameStarted = false;
      }
    },
    deep: true
  },
  methods: {
    reset() {
      eventBus.$emit('resetAll');
    },
    onTimerStop(minutes, seconds) {
      this.time.minutes = minutes;
      this.time.seconds = seconds;
    },
    startNewGame() {
      this.resetData();
      this.reset();
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
      this.isGameStarted = true;
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
      this.isGameStarted = false;
      this.isPlayerWon = false;
      this.itemsClicked = [];
      this.itemsGuessed = [];
      this.items = [];
      clearTimeout(this.initialDelay)
    }
  },
  components: {
    appTile: Tile,
    appTimer: Timer
  }
}
</script>

<style lang="scss">
  .card-container {
    display: flex;
    flex-wrap: wrap;
    width: 600px;
    height: 600px;
  }
  .flip-list-move {
    transition: transform .5s;
  }

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
        transition: opacity 1s;
        opacity: 1;
      }
    }

    &-leave {
      &-active {
        transition: opacity 1s;
        opacity: 0;
      }
    }
  }
</style>
