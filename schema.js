const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

const axios = require('axios');

// Customer Type

const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: {
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
  },
});

// Hardcode data

// const customers = [
//   {
//     id: '1',
//     name: 'John Doe',
//     email: 'john@mail.com',
//     age: 35,
//   },
//   {
//     id: '2',
//     name: 'Steve Smith',
//     email: 'steve@mail.com',
//     age: 39,
//   },
//   {
//     id: '3',
//     name: 'Jack London',
//     email: 'jack@mail.com',
//     age: 45,
//   },
// ];

//Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        // for (let i = 0; i < customers.length; i++) {
        //   if (customers[i].id === args.id) {
        //     return customers[i];
        //   }
        // }
        return axios
          .get('http://localhost:3000/customers/' + args.id)
          .then((res) => res.data);
      },
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios
          .get('http://localhost:3000/customers')
          .then((res) => res.data);
      },
    },
  },
});

//Mutation

const mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }, //Required
        email: { type: new GraphQLNonNull(GraphQLString) }, //Required
        age: { type: new GraphQLNonNull(GraphQLInt) }, //Required
      },
      resolve(parentValue, args) {
        return axios
          .post('http://localhost:3000/customers', {
            name: args.name,
            email: args.email,
            age: args.age,
          })
          .then((res) => res.data);
      },
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        return axios
          .delete('http://localhost:3000/customers/' + args.id)
          .then((res) => res.data);
      },
    },

    updateCustomer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, args) {
        return axios
          .put('http://localhost:3000/customers/' + args.id, args)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
