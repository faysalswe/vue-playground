<template>
  <div id="scrum-poker">
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
      <div style="width: 50%; display: flex; justify-content: space-around;">
        <span v-clipboard:copy="fullUrl" class="icon-btn-lg"
          ><ion-icon name="copy-sharp"></ion-icon> Copy Link</span
        >
        <span v-if="isAdminUser" class="icon-btn-lg" @click="cleanScores"
          ><ion-icon name="reload-sharp"></ion-icon> Clear</span
        >
        <span v-if="isAdminUser" class="icon-btn-lg" @click="toggleShowPoint">
          <span v-if="room.isShowPoint"
            ><ion-icon name="eye-off-sharp"></ion-icon> Invisible
          </span>
          <span v-else><ion-icon name="eye-sharp"></ion-icon> Visible </span>
          All
        </span>
      </div>

      <form
        style="width: 50%;"
        v-if="isAdminUser"
        @submit="addOrUpdateCardPontSummary($event, card.index)"
      >
        <input
          style="width: 55%;"
          type="text"
          v-model="card.name"
          placeholder="Name"
          name="name"
        />
        <input
          style="width: 25%;"
          type="number"
          v-model="card.point"
          placeholder="Point"
          name="point"
          step="0.01"
        />
        <button :style="card.index > 0 ? 'width: 10%;' : 'width: 20%;'">
          <ion-icon name="save-sharp"></ion-icon>
        </button>
        <button
          v-if="card.index > 0"
          style="width: 10%;"
          @click="deleteSummaryCardPoint(card.index)"
        >
          <ion-icon name="trash-sharp"></ion-icon>
        </button>
      </form>
    </div>

    <div class="container">
      <div v-if="room.userPoints.length" class="summary-points">
        <p style="font-size: 18px; font-wight: bold;">Team Points</p>
        <p></p>
        <div
          class="list"
          v-for="(user, index) in room.userPoints"
          :key="index"
          :class="{ 'marked-row': user.userId == $route.params.userId }"
        >
          <span class="user icon-btn-sm" @click="toggleAdmin(user)">
            <ion-icon v-if="user.isAdmin" name="person"></ion-icon>
            <ion-icon v-else name="person-outline"></ion-icon>
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
            v-else-if="!user.isEdit && user.userId == $route.params.userId"
            class="point icon-btn-sm"
            @click="onEdit(user, index)"
          >
            <span style="color: #42b983" v-if="user.point">
              {{ user.point }}
            </span>
            <ion-icon
              style="color: #f44336"
              v-else
              name="hourglass-sharp"
            ></ion-icon>
          </span>
          <span v-else class="point icon-btn-sm" @click="onEdit(user, index)">
            <ion-icon
              style="color: #f44336"
              v-if="user.point <= 0"
              name="hourglass-sharp"
            ></ion-icon>
            <span v-else-if="room.isShowPoint"> {{ user.point }} </span>
            <ion-icon v-else name="eye-off-sharp"></ion-icon>
          </span>
          <span
            v-if="isAdminUser"
            class="icon-btn-sm remove"
            @click="remove(user)"
          >
            <ion-icon name="trash-sharp"></ion-icon>
          </span>
        </div>
      </div>

      <div v-if="room.scoredCards.length" class="user-points">
        <P style="font-size: 18px; font-wight: bold;">Card Points</P>
        <form
          class="mobile"
          style="width: 50%;"
          v-if="isAdminUser"
          @submit="addOrUpdateCardPontSummary($event, card.index)"
        >
          <input
            style="width: 55%;"
            type="text"
            v-model="card.name"
            placeholder="Name"
            name="name"
          />
          <input
            style="width: 25%;"
            type="number"
            v-model="card.point"
            placeholder="Point"
            name="point"
            step="0.01"
          />
          <button :style="card.index > 0 ? 'width: 10%;' : 'width: 20%;'">
            <ion-icon name="save-sharp"></ion-icon>
          </button>
          <button
            v-if="card.index > 0"
            style="width: 10%;"
            @click="deleteSummaryCardPoint(card.index)"
          >
            <ion-icon name="trash-sharp"></ion-icon>
          </button>
        </form>
        <div
          class="list"
          v-for="(scoredCard, index) in room.scoredCards"
          :key="index"
          :style="index === card.index ? 'background-color: #42b98336;' : ''"
          :class="{ 'marked-row': index == 0 }"
          @click="editCardSummaryPoint(index)"
        >
          <span>{{ scoredCard.name }}</span> <span>{{ scoredCard.point }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { database } from "../firebase/firebase";
export default {
  name: "scram-poker",
  data() {
    return {
      fullUrl: "",
      isAdminUser: false,
      roomRef: {},
      roomRefChanges: {},
      room: {
        userPoints: [],
        scoredCards: [],
        isShowPoint: false
      },
      points: [0.5, 1, 2, 3, 5, 8, 13, 21],
      card: { index: "", name: "", point: "" }
    };
  },
  created() {
    this.roomRef = database.ref(`rooms/${this.$route.params.roomId}`);

    this.roomRefChanges = this.roomRef.on("value", snapshot => {
      this.room = snapshot.val();
      const user = this.room.userPoints.find(
        x => x.userId == this.$route.params.userId
      );

      if (!user) {
        this.$router.push({
          path: `/${this.$route.params.roomId}`
        });
      }

      this.isAdminUser = user && user.isAdmin ? true : false;
    });
    this.fullUrl = `${window.location.origin}/#/${this.$route.params.roomId}`;
  },
  beforeDestroy() {
    this.roomRef.off("value", this.roomRefChanges);
  },
  methods: {
    givePoint(point) {
      this.roomRef.once("value", res => {
        this.room = res.val();
        const index = this.room.userPoints.findIndex(
          x => x.userId == this.$route.params.userId
        );
        this.room.userPoints[index].point = point;
        this.roomRef.update({ ...this.room });
      });
    },
    addOrUpdateCardPontSummary($event, index) {
      $event.preventDefault();

      if (!this.card.name || !this.card.point) return;

      this.roomRef.once("value", res => {
        this.room = res.val();

        if (index > 0) {
          this.room.scoredCards[0].point =
            this.room.scoredCards[0].point - this.room.scoredCards[index].point;
          this.room.scoredCards[index].name = this.card.name;
          this.room.scoredCards[index].point = this.card.point;
          this.room.scoredCards[0].point =
            Number(this.room.scoredCards[0].point) + Number(this.card.point);
        } else {
          this.room.scoredCards.splice(1, 0, { ...this.card });
          this.room.scoredCards[0].point = this.room.scoredCards.reduce(
            (total, item) => {
              return total + Number(item.point);
            },
            -this.room.scoredCards[0].point
          );
        }
        this.roomRef.update({ ...this.room });
      });

      this.card = {};
    },
    editCardSummaryPoint(index) {
      if (this.isAdminUser && index > 0 && index != this.card.index) {
        this.roomRef.once("value", res => {
          this.room = res.val();
          this.card = { ...this.room.scoredCards[index], index };
          this.roomRef.update({ ...this.room });
        });
      } else {
        this.card = {};
      }
    },
    deleteSummaryCardPoint(index) {
      if (this.isAdminUser && index > 0) {
        this.roomRef.once("value", res => {
          this.room = res.val();
          this.room.scoredCards[0].point =
            this.room.scoredCards[0].point - this.room.scoredCards[index].point;
          this.room.scoredCards.splice(index, 1);
          this.roomRef.update({ ...this.room });
        });
        this.card = {};
      }
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
      this.roomRef.once("value", res => {
        this.room = res.val();
        const index = this.room.userPoints.findIndex(
          x => x.userId == this.$route.params.userId
        );
        this.room.userPoints[index].point = $event.target.value;
        this.room.userPoints[index].isEdit = false;
        this.roomRef.update({ ...this.room });
      });
    },
    toggleShowPoint() {
      this.roomRef.once("value", res => {
        this.room = res.val();
        this.room.isShowPoint = !this.room.isShowPoint;
        this.roomRef.update({ ...this.room });
      });
    },
    toggleAdmin(user) {
      if (this.isAdminUser && user.userId != this.$route.params.userId) {
        this.roomRef.once("value", res => {
          this.room = res.val();
          const index = this.room.userPoints.findIndex(
            x => x.userId == user.userId
          );
          this.room.userPoints[index].isAdmin = !this.room.userPoints[index]
            .isAdmin;
          this.roomRef.update({ ...this.room });
        });
      }
    },
    cleanScores() {
      this.roomRef.once("value", res => {
        this.room = res.val();
        this.room.userPoints.forEach(x => (x.point = ""));
        this.room.isShowPoint = false;
        this.roomRef.update({ ...this.room });
      });
    },
    remove(user) {
      if (this.isAdminUser && user.userId != this.$route.params.userId) {
        this.roomRef.once("value", res => {
          this.room = res.val();
          const index = this.room.userPoints.findIndex(
            x => x.userId == user.userId
          );
          this.room.userPoints.splice(index, 1);
          this.roomRef.update({ ...this.room });
        });
      }
    }
  }
};
</script>

<style>
.mobile {
  display: none;
}

.marked-row {
  border-left: 5px solid #42b983;
}

.manual-input {
  max-width: 35px;
  height: 0.9rem;
  font-size: 15px;
}

.icon-btn-sm {
  font-size: 15px;
  cursor: pointer;
}

.icon-btn-lg {
  cursor: pointer;
  font-size: 17px;
}

.icon-btn-lg:hover {
  cursor: pointer;
  font-size: 18px;
  color: #42b983;
}

.container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
}

.container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
}

.summary-points,
.user-points {
  width: 50%;
}

@media only screen and (max-width: 600px) {
  .summary-points,
  .user-points {
    width: 100%;
  }
  .card {
    margin: 0.5rem !important;
    padding: 1rem 1.5rem !important;
  }
  .lg-md-display {
    display: none;
  }

  .mobile {
    display: block;
    margin-bottom: 10px;
  }
  form > * {
    margin-bottom: 10px;
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

.list:hover {
  background-color: #42b98336;
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
  text-align: center;
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

.red-border {
  border: 1px solid red;
}

.green-border {
  border: 1px solid green;
}
</style>
