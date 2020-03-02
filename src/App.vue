<template>
  <div class="container">
    <h1 class="display-4 mb-4 text-center">Memory. The Game</h1>
    <div class="d-flex align-items-center mb-4">
      <button class="btn btn-primary mx-auto" @click="reset" :disabled="userName === ''">Новая игра</button>
    </div>
    <transition name="fade" mode="out-in" appear>
      <div class="d-flex flex-column align-items-center" v-if="!isGameStarted && !isPlayerWon">
        <div class="card p-3">
          <label for="userName">Введите ваше имя</label>
          <input type="text" id="userName" name="userName" class="form-control" placeholder="John Doe" v-model="userName">
        </div>
        <p class="lead mt-4">
          После начала игры у вас будет 10 секунд, чтобы запомнить все клетки. После этого нужно как можно быстрее открыть все клетки: нажмите на клетку, а затем найдите точно такую же.
        </p>
      </div>
      <the-game @gameOver="onGameOver"
                v-else-if="isGameStarted && !isPlayerWon"></the-game>
      <div v-else-if="isPlayerWon">
        <p class="lead mt-5">
          Вы выиграли! Ваше время - <strong>{{ time.minutes }}:{{ time.seconds }}</strong>
        </p>
        <p class="h3">Таблица лидеров:</p>
        <app-score-table :limit="10"></app-score-table>
      </div>
    </transition>
  </div>
</template>

<script>
import Game from "./components/Game";
import { eventBus } from "./main";
import { db } from "./db";
import { prettifyTime } from "./timeHelper";
import ScoreTable from "./components/ScoreTable";


export default {
  name: 'App',
  data() {
    return {
      userName: '',
      isGameStarted: false,
      isPlayerWon: false,
      time: {},
      scores: [],
      scoresReady: false
    }
  },
  methods: {
    reset() {
      this.isGameStarted = true;
      this.isPlayerWon = false;
      eventBus.$emit('resetAll');
    },
    onGameOver(time) {
      this.isPlayerWon = true;
      this.isGameStarted = false;
      this.time = time;
    },
    prettifyNumber(value) {
      return prettifyTime(value);
    },
    submitResult() {
      let userRef = db.collection('scores').doc(this.userName);
      let seconds = this.time.minutes * 60 + this.time.seconds;
      userRef.get().then(snapshot => {
        let playerExists = snapshot.exists;
        let playerData = snapshot.data();
        if (!playerExists || playerData.time > seconds) {
          userRef.set({
            time: seconds,
          })
        }
      });

    }
  },
  components: {
    theGame: Game,
    appScoreTable: ScoreTable
  },
  created() {
    eventBus.$on('timerStopped', time => {
      this.time = time;
      this.submitResult();
    })
  }
}
</script>

<style lang="scss">
  button:disabled {
    cursor: not-allowed;
  }
  .flip-list-move {
    transition: transform .5s;
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
