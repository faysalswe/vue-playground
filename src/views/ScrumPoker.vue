<template>
  <div>
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
      <span v-clipboard:copy="fullUrl" class="icon-btn-lg">
        📋
      </span>
      <span v-if="isAdminUser" class="icon-btn-lg" @click="cleanScores">
        🔄
      </span>
      <span v-if="isAdminUser" class="icon-btn-lg" @click="toggleShowPoint">
        {{ room.isShowPoint ? "🔓" : "🔒" }}
      </span>
      <form v-if="isAdminUser" @submit="final($event)">
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
        <button type="submit">Final</button>
      </form>
    </div>

    <div class="container">
      <div class="summury-points">
        <h4>
          Current card points
        </h4>
        <div class="list" v-for="(user, index) in room.userPoints" :key="index">
          <span class="user icon-btn-sm" @click="toggleAdmin(user)">
            {{ user.isAdmin ? "👤" : "👥" }}
          </span>
          <span class="name">
            {{ user.name }}
          </span>
          <span v-if="user.isEdit" class="point">
            <input
              class="manual-input"
              type="number"
              @blur="save(user, $event)"
              :value="user.point"
            />
          </span>
          <span
            v-if="!user.isEdit"
            class="point icon-btn-sm"
            @click="onEdit(user, index)"
          >
            {{
              user.point > 0 ? (room.isShowPoint ? user.point : "🔒") : "⌛️"
            }}
          </span>
          <span
            v-if="isAdminUser"
            class="icon-btn-sm remove"
            @click="remove(user)"
          >
            ❌
          </span>
        </div>
      </div>

      <div class="user-points">
        <h4>Card points summary</h4>
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
      isAdminUser: false,
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
      const user = this.room.userPoints.find(
        x => x.userId == this.$route.params.userId && x.isAdmin == true
      );
      this.isAdminUser = user ? true : false;
    });
    this.fullUrl = `${window.location.origin}/#/${this.$route.params.roomId}`;
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
    final($event) {
      $event.preventDefault();
      if (!this.card.name || !this.card.point) return;
      const ref = database.ref(`rooms/${this.$route.params.roomId}`);
      ref.once("value", res => {
        this.room = res.val();
        this.room.scoredCards.push({ ...this.card });

        this.room.scoredCards[0].point = this.room.scoredCards.reduce(
          (total, item) => {
            return total + Number(item.point);
          },
          -this.room.scoredCards[0].point
        );

        this.room.userPoints.forEach(x => (x.point = ""));
        this.room.isShowPoint = false;
        ref.update({ ...this.room });
      });
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
    },
    toggleAdmin(user) {
      if (this.isAdminUser && user.userId != this.$route.params.userId) {
        const ref = database.ref(`rooms/${this.$route.params.roomId}`);
        ref.once("value", res => {
          this.room = res.val();
          const index = this.room.userPoints.findIndex(
            x => x.userId == user.userId
          );
          this.room.userPoints[index].isAdmin = !this.room.userPoints[index]
            .isAdmin;
          ref.update({ ...this.room });
        });
      }
    },
    cleanScores() {
      const ref = database.ref(`rooms/${this.$route.params.roomId}`);
      ref.once("value", res => {
        this.room = res.val();
        this.room.userPoints.forEach(x => (x.point = ""));
        this.room.isShowPoint = false;
        ref.update({ ...this.room });
      });
    },
    remove(user) {
      if (this.isAdminUser && user.userId != this.$route.params.userId) {
        const ref = database.ref(`rooms/${this.$route.params.roomId}`);
        ref.once("value", res => {
          this.room = res.val();
          const index = this.room.userPoints.findIndex(
            x => x.userId == user.userId
          );
          this.room.userPoints.splice(index, 1);
          ref.update({ ...this.room });
        });
      }
    }
  }
};
</script>

<style>
.manual-input {
  max-width: 35px;
  height: 0.9rem;
  font-size: 15px;
}
.icon-btn-sm {
  font-size: 13px;
  cursor: pointer;
}

.icon-btn-lg {
  cursor: pointer;
  font-size: 20px;
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

@media only screen and (max-width: 600px) {
  .summury-points,
  .user-points {
    width: 100%;
  }
  .card {
    border-radius: 3px;
    margin: none;
    padding: none;
  }
}
.list {
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 1px;
  margin: 0.1rem;
  padding: 0.5rem;
  text-align: left;
}

.user {
  flex-basis: 6%;
}
.name {
  flex-basis: 60%;
}
.point {
  flex-basis: 30%;
  font-weight: bolder;
}
.remove {
  flex-basis: 4%;
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
  border: 1px solid #42b983;
}

input {
  padding-left: 0.5rem;
}

button {
  background-color: #42b983;
  font-size: 16px;
  box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 2px;
  cursor: pointer;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;
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
