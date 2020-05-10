<template>
  <div>
    <input type="text" v-model="fullUrl" />
    <div class="container">
      <div
        class="card"
        v-for="(point, index) in points"
        :key="index"
        @click="givePoint(point)"
      >
        <div class="card-point">
          {{ point }}
        </div>
      </div>
    </div>

    <div class="container">
      <div class="summury-points">
        <h4>
          Current card points
          <div style="cursor: pointer;" @click="toggleShowPoint()">
            {{ this.room.isShowPoint ? "🔓" : "🔒" }}
          </div>
        </h4>
        <div class="list" v-for="(user, index) in room.userPoints" :key="index">
          <span> {{ user.name }} </span>
          <span v-if="user.isEdit">
            <input type="text" @blur="save(user, $event)" :value="user.point" />
          </span>
          <span @click="onEdit(user)" v-if="!user.isEdit">
            {{
              user.point > 0
                ? this.room.isShowPoint
                  ? user.point
                  : "🔒"
                : "⏳"
            }}
          </span>
        </div>
      </div>

      <div class="user-points">
        <h4>Card points summary</h4>
        <form @submit="addFinalPoint($event)">
          <input
            type="text"
            v-model="card.name"
            placeholder="Name"
            name="name"
            id="name"
          />
          <input
            type="number"
            v-model="card.point"
            placeholder="Point"
            name="point"
            id="point"
          />
          <button type="submit">Finalize sizing</button>
        </form>
        <div
          class="list"
          v-for="(card, index) in room.scoredCards"
          :key="index"
        >
          <span>{{ card.name }}</span> <span>{{ card.point }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { database } from "../firebase/firebase";
export default {
  name: "scarm-poker",
  data() {
    return {
      fullUrl: "",
      room: {
        userPoints: [],
        scoredCards: [],
        isShowPoint: false
      },
      points: [0.5, 1, 2, 3, 5, 8, 13, 21],
      card: { name: "", point: "" }
    };
  },
  created() {
    const ref = database.ref(`rooms/${this.$route.params.roomId}`);
    ref.on("value", snapshot => {
      this.room = snapshot.val();
      console.log(this.room);
    });
    this.fullUrl = `${window.location.origin}/#/join-room/${this.$route.params.roomId}`;
  },
  methods: {
    givePoint(point) {
      const ref = database.ref(`rooms/${this.$route.params.roomId}`);
      ref.once("value", res => {
        this.room = res.val();
        const index = this.room.userPoints.findIndex(
          x => x.userId == this.$route.params.userId
        );
        this.room.userPoints[index].point = point;
        ref.update({ ...this.room });
      });
    },
    addFinalPoint($event) {
      $event.preventDefault();
      const ref = database.ref(`rooms/${this.$route.params.roomId}`);
      ref.once("value", res => {
        this.room = res.val();
        this.room.scoredCards.push({ ...this.card });
        this.room.scoredCards[0].point = this.room.scoredCards.reduce(
          (total, item) => {
            return total + Number(item.point);
          },
          0
        );
        this.room.userPoints.forEach(x => (x.point = ""));
        this.room.isShowPoint = false;
        ref.update({ ...this.room });
      });
      // clear
      this.card = {};
    },
    onEdit(user) {
      if (this.$route.params.userId == user.userId) {
        const index = this.room.userPoints.findIndex(
          x => x.userId == user.userId
        );
        this.room.userPoints[index].isEdit = true;
      }
    },
    save(user, $event) {
      const ref = database.ref(`rooms/${this.$route.params.roomId}`);
      ref.once("value", res => {
        this.room = res.val();
        const index = this.room.userPoints.findIndex(
          x => x.userId == this.$route.params.userId
        );
        this.room.userPoints[index].point = $event.target.value;
        this.room.userPoints[index].isEdit = false;
        ref.update({ ...this.room });
      });
    },
    toggleShowPoint() {
      const ref = database.ref(`rooms/${this.$route.params.roomId}`);
      ref.once("value", res => {
        this.room = res.val();
        this.room.isShowPoint = !this.room.isShowPoint;
        ref.update({ ...this.room });
      });
    }
  }
};
</script>

<style>
.copy {
}
.container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
}

.summury-points,
.user-points {
  width: 50%;
}

.list {
  box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 1px; /* 5px rounded corners */
  margin: 0.1rem;
  padding: 0.5rem;
  text-align: left;
}

.list > :nth-child(1) {
  display: inline-block;
  width: 80%;
}

.list > :nth-child(2) {
  width: 20%;
}

form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

form > input,
button {
  box-sizing: border-box;
  width: 100%;
  height: 1.9rem;
  margin: 5px 5px;
  border: 1px solid #42b983;
}

button {
  background-color: #42b983;
  font-size: 16px;
  box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 2px; /* 5px rounded corners */
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px; /* 5px rounded corners */
  margin: 1rem;
  padding: 2rem;
  cursor: pointer;
}

.card:hover {
  background-color: #42b98336;
}

.card-point {
  color: #42b983;
  font-size: 30px;
}
</style>
