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

        <span v-clipboard:copy="fullUrl" class="icon-btn-lg">
          <ion-icon style="vertical-align: top;" name="copy-sharp"></ion-icon> Copy Link
        </span>

        <span v-if="isAdminUser" class="icon-btn-lg" @click="cleanScores">
          <ion-icon style="vertical-align: top;" name="reload-sharp"></ion-icon> Clear
        </span>

        <span v-if="isAdminUser" class="icon-btn-lg" @click="toggleShowPoint">
          <span v-if="room.isVisibleToAll"
            ><ion-icon style="vertical-align: top;" name="eye-off-sharp"></ion-icon> Invisible
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
          v-model="card.title"
          placeholder="Title"
          name="title"
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
      <div v-if="room.users.length" class="summary-points">
        <p style="font-size: 18px; font-wight: bold;">Team Points</p>
        <p></p>
        <div
          class="list"
          v-for="(user, index) in room.users"
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
            <span v-else-if="room.isVisibleToAll"> {{ user.point }} </span>
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

      <div v-if="room.cards.length" class="user-points">
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
            v-model="card.title"
            placeholder="Title"
            name="title"
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
          v-for="(scoredCard, index) in room.cards"
          :key="index"
          :class="{ 'marked-row': index == 0 }"
        >
          <div style="width: 85%; display:flex; justify-content: space-between;">
            <span> {{ scoredCard.title }} </span>
            <span> {{ scoredCard.point }} </span>
          </div>
          <div v-if="index > 0 && isAdminUser">
            <ion-icon
              style="margin-right: 7px;"
              class="icon-btn-sm"
              :name="index != card.index ? 'create-sharp' : 'refresh-sharp'"
              @click="editCardSummaryPoint(index)"
            >
            </ion-icon>
            <ion-icon
              class="icon-btn-sm"
              name="list-sharp"
              @click="showCardUserPoints(index)"
            >
            </ion-icon>
          </div>
        </div>
      </div>

      <modal v-if="showModal" @close="showModal = false; card.index = null;">
        <div slot="body">
          <div
            class="list"
            v-for="(scoredCard, index) in room.cards[card.index].userCardPoints"
            :key="index"
          >
            <span>{{ scoredCard.name }}<span style="font-style:italic; font-size: 12px;"> (@{{ scoredCard.userId }})</span> </span>
            <span>{{ scoredCard.point ? scoredCard.point : '-' }}</span>
          </div>
        </div>
        
        <h4 slot="header"> "{{ room.cards[index].title }}" user points </h4>
      </modal>
    </div>
  </div>
</template>

<script>
import Modal from '../shared/components/modal';
import { Room } from "../constants/ApiUrl";
import { getData, putData } from "../shared/httpHandler";
import { BASE_API_URL }  from '../environment/env.dev.js';
export default {
  name: "scram-poker",
  components: {
    Modal
  },
  data() {
    return {
      fullUrl: "",
      showModal: false,
      isAdminUser: false,
      room: {
        users: [],
        cards: [],
        isVisibleToAll: false,
      },
      points: [0.5, 1, 2, 3, 5, 8, 13, 21],
      card: { index: "", name: "", point: "" },
      eventSource: {}
    };
  },
  created() {
    this.eventSource = new EventSource(`${BASE_API_URL}${Room.BASE}/${Room.SSE}`);
    console.log("readyState", this.eventSource.readyState);
    getData(`${Room.BASE}/${this.$route.params.roomId}`).then((res) => {
      this.room = res;
      const user = this.room.users.find(
        (x) => x.userId == this.$route.params.userId
      );

      if (!user) {
        this.$router.push({
          path: `/${this.$route.params.roomId}`,
        });
      }

      this.isAdminUser = user && user.isAdmin;
      this.fullUrl = `${window.location.origin}/#/${this.$route.params.roomId}`;
    console.log("readyState", this.eventSource.readyState);
      this.initSSEEvent();
    });
  },
  beforeDestroy() {
     this.eventSource.close();
  },
  methods: {
    initSSEEvent() {
    console.log("readyState", this.eventSource.readyState);

      this.eventSource.onmessage = event => {
        const data = JSON.parse(event.data);
        console.log("sse success", data);
        if (data) {
          this.room = data;
          const user = this.room.users.find(
            x => x.userId == this.$route.params.userId
          );
          this.isAdminUser = user && user.isAdmin;
        }
      };
      this.eventSource.onopen = function (evt) {
          console.log("sse onopen", event);
      }
      this.eventSource.onerror = event => {
        console.log("sse error", event);
      };
    },
    UpdateRoom() {
      putData(Room.BASE, this.room)
        .then(res => {
          if (res) {
            this.room = res;
          }
        })
        .catch(err => {});
    },
    givePoint(point) {
      const index = this.room.users.findIndex(
        x => x.userId == this.$route.params.userId
      );
      this.room.users[index].point = point;
      this.UpdateRoom();
    },
    addOrUpdateCardPontSummary($event, index) {
      $event.preventDefault();

      if (!this.card.title || !this.card.point) return;

      if (index > 0) {
        this.room.cards[0].point =
          this.room.cards[0].point - this.room.cards[index].point;
        this.room.cards[index].title = this.card.title;
        this.room.cards[index].point = this.card.point;
        this.room.cards[0].point =
          Number(this.room.cards[0].point) + Number(this.card.point);
      } else {
        this.room.cards.splice(1, 0, { ...this.card });
        this.room.cards[0].point = this.room.cards.reduce((total, item) => {
          return total + Number(item.point);
        }, -this.room.cards[0].point);
        this.room.cards[1].userCardPoints = this.room.users.map((x) => ({
          name: x.name,
          userId: x.userId,
          point: x.point
        }));
      }
      this.UpdateRoom();
      this.card = {};
    },
    editCardSummaryPoint(index) {
      if (this.isAdminUser && index > 0 && index != this.card.index) {
        this.card = { ...this.room.cards[index], index };
      } else {
        this.card = {};
      }
    },
    deleteSummaryCardPoint(index) {
      if (this.isAdminUser && index > 0) {
        this.room.cards[0].point =
          this.room.cards[0].point - this.room.cards[index].point;
        this.room.cards.splice(index, 1);
        this.UpdateRoom();
        this.card = {};
      }
    },
    onEdit(user) {
      if (this.$route.params.userId == user.userId) {
        const index = this.room.users.findIndex(x => x.userId == user.userId);
        this.room.users[index].isEdit = true;
      }
    },
    save(user, $event) {
      const index = this.room.users.findIndex(
        x => x.userId == this.$route.params.userId
      );
      this.room.users[index].point = $event.target.value;
      this.room.users[index].isEdit = false;
      this.UpdateRoom();
    },
    toggleShowPoint() {
      this.room.isVisibleToAll = !this.room.isVisibleToAll;
      this.UpdateRoom();
    },
    toggleAdmin(user) {
      if (this.isAdminUser && user.userId != this.$route.params.userId) {
        const index = this.room.users.findIndex(x => x.userId == user.userId);
        this.room.users[index].isAdmin = !this.room.users[index].isAdmin;
        this.UpdateRoom();
      }
    },
    cleanScores() {
      this.room.users.forEach(x => (x.point = ""));
      this.room.isVisibleToAll = false;
      this.UpdateRoom();
    },
    remove(user) {
      if (this.isAdminUser && user.userId != this.$route.params.userId) {
        const index = this.room.users.findIndex(x => x.userId == user.userId);
        this.room.users.splice(index, 1);
        this.UpdateRoom();
      }
    },
    showCardUserPoints(index) {
      this.showModal = !this.showModal;
      this.card.index = index;
    },
  },
};
</script>

<style>
.mobile {
  display: none;
}

.marked-row {
  border-left: 5px solid #42b983 !important;
}

.manual-input {
  max-width: 35px;
  height: 0.9rem;
  font-size: 15px;
}

.icon-btn-sm {
  font-size: 14px;
}

.icon-btn-sm:hover {
  cursor: pointer;
  color: #42b983;
}

.icon-btn-lg {
  font-size: 16px;
  vertical-align: text-top;
}

.icon-btn-lg:hover {
  vertical-align: text-top;
  cursor: pointer;
  font-size: 17px;
  color: #42b983;
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
  border-left: 5px solid transparent;
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
</style>
