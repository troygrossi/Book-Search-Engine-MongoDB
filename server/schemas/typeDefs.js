const {gql} = require("apollo-server-express");

const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
}
type Book{
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
}
type Auth{
    token: ID!
    user: User
}
type Query {
    users: [User]
    me: User
}
type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(authors: [String], description: String!, bookId: String!, image: String!, link: String, title: String): User
    removeBook(bookId: String!): User
}
`

module.exports = typeDefs;

