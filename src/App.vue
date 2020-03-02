<template>
  <div class="container">
    <h1 class="display-4 mb-4">Memory. The Game</h1>
    <span>
      <button class="btn btn-primary" @click="reset" :disabled="userName === ''">Новая игра</button>
      <button class="btn btn-primary" @click="dbTest" :disabled="userName === ''">dbTest</button>
    </span>
    <transition name="fade" mode="out-in" appear>
      <div v-if="!isGameStarted && !isPlayerWon">
        <label for="userName">Введите ваше имя</label>
        <input type="text" id="userName" name="userName" class="form-control w-25" placeholder="John Doe" v-model="userName">
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
      console.log(this.userName);
      let userRef = db.collection('scores').doc(this.userName);
      let seconds = this.time.minutes * 60 + this.time.seconds;
      userRef.get().then(snapshot => {
        let playerExists = snapshot.exists;
        let playerData = snapshot.data();
        console.log(playerExists);
        if (!playerExists || playerData.time > seconds) {
          console.log(seconds);
          userRef.set({
            time: seconds,
          }).then(function() {
            console.log("player successfully added!");
          })
        }
      });

    },
    dbTest() {
      console.log(this.userName);
      db.collection('scores').doc(this.userName).get().then(snapshot => {
        console.log(snapshot)
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
  .card-container {
    display: flex;
    flex-wrap: wrap;
    width: 600px;
    height: 600px;
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
