<template>
  <div>
    <h1>Form</h1>
    <form @submit="create">
      <label> Name: </label>
      <input type="text" v-model="person.name" />

      <label> Age: </label>
      <input type="number" v-model="person.age" />

      <label> Address: </label>
      <input type="text" v-model="person.address" />

      <button type="submit">save</button>
      <button type="reset">clear</button>
    </form>
    <div>
      <table>
        <thead>
          <td>#SL</td>
          <td>Name</td>
          <td>Age</td>
          <td>Address</td>
          <td>Action</td>
        </thead>
        <tbody>
          <tr v-for="(person, index) in personList" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ person.name }}</td>
            <td>{{ person.age }}</td>
            <td>{{ person.address }}</td>
            <td>
              <button type="button" @click="update(person.id)">edit</button>
              <button type="button" @click="remove(person.id)">delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Form",
  data() {
    return {
      person: {
        id: "",
        name: "",
        age: "",
        address: ""
      },
      personList: [
        { id: 1, name: "Faysal", age: 26, address: "Mohammadpur" },
        { id: 2, name: "Justin", age: 23, address: "canada" }
      ]
    };
  },
  methods: {
    create($event) {
      if (this.person.id <= 0) {
        this.personList.push({ ...this.person });
      } else {
        const index = this.personList.findIndex(x => x.id === this.person.id);
        this.personList[index] = { ...this.person };
      }
      console.log($event.target.reset());
    },
    update(id) {
      const person = this.personList.find(x => x.id === id);
      this.person = { ...person };
    },
    remove(id) {
      const index = this.personList.findIndex(x => x.id === id);
      this.personList = this.personList.slice(index, 1);
    }
  }
};
</script>
<style scoped>
input {
  border: 2px solid #42b983;
}
table {
  margin-top: 5rem;
  width: 100%;
}
thead {
  font-weight: bolder;
  color: #42b983;
  background-color: transparent;
}
td {
  border: 1px solid #42b983;
}
button {
  background: #42b983;
  border: none;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 2px;
  margin: 1px;
  padding: 0.2rem 0.5rem;
}
</style>
