const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  graphql,
} = require("graphql");

const users = [
  { id: 1, name: "khan", age: 27 },
  { id: 2, name: "danish", age: 26 },
  { id: 3, name: "irfan", age: 34 },
  { id: 4, name: "ali", age: 12 },
  { id: 5, name: "owais", age: 44 },
];
const userType = new GraphQLObjectType({
  name: "users",
  description: "...",
  fields: {
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
  },
});
const schema = new GraphQLSchema({
  //root Query
  query: new GraphQLObjectType({
    name: "Query",
    description: "...",

    fields: () => ({
      //multiple users query
      users: {
        type: new GraphQLList(userType),
        resolve: (parent, args) => {
          return users;
        },
      },
      //single user query
      user: {
        type: userType,
        args: {
          id: {
            type: GraphQLInt,
          },
        },
        resolve: (parent, { id }) => {
          const user = users.filter((user) => user.id == id);
          console.log("users", user);
          return user[0];
        },
      },
    }),
  }),
});

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.get("/", (req, res) => {
  const query = `query{users{id,name,age}}`;
  graphql(schema, query)
    .then((response) => res.send(response))
    .catch((err) => res.send(err));
});

app.get("/:id", (req, res) => {
  const query = `query {user(id: ${req.params.id}){id,name,age}}`;
  graphql(schema, query)
    .then((response) => res.send(response))
    .catch((err) => res.send(err));
});

app.listen(3000, () => console.log("sever on"));
