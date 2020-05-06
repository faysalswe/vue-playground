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
      <button type="button" @click="clear">clear</button>
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
    create() {
      if (this.person.id <= 0) {
        this.personList.push({ ...this.person });
      } else {
        const index = this.personList.findIndex(x => x.id === this.person.id);
        this.personList[index] = this.person;
      }
      this.clear();
    },
    update(id) {
      const person = this.personList.find(x => x.id === id);
      this.person = { ...person };
    },
    remove(id) {
      const index = this.personList.findIndex(x => x.id === id);
      this.personList = this.personList.slice(index, 1);
    },
    clear() {
      this.person = {};
    }
  }
};
</script>

<style>
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
  background: transparent;
  color: #42b983;
  border: 1px solid teal;
}
</style>
