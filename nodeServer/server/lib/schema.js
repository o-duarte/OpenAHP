/*
 * Graphql Types Defs.
 */

const types = `
  type User {
    id: ID
    email: String
    password: String
    fullname: String
    image: String
    accountType: String
    isAdmin: Boolean
    isTeamLeader: Boolean
    team: Team
  }

  type Team {
    id: ID
    name: String
    description: String
  }

  type Document {
    id: ID
    title: String
    description: String
    status: String
    type: DocumentType
    content: DocumentContent
    contentVersions: [DocumentContent]
    owner: User
    contributors: [User]
    tags: [Tag]
    createdAt: String
    updatedAt: String
  }

  type DocumentContent {
    id: ID
    docOwner: User
    version: String
    description: String
    html: String
    raw: String
    createdAt: String
    updatedAt: String
  }

  type DocumentType {
    id: ID
    name: String
    description: String
  }

  type Tag {
    id: ID
    name: String!
    description: String!
    creator: User
    createdAt: String
    updatedAt: String
  }
`;

/*
 * Graphql Queries.
 */

const queries = `
  type Query {
    currentUser: User
    currentUserDocuments(statusList:[String]): [Document]!
    currentUserSingleDocument(documentId: ID!): Document
  }
`;

/*
 * Graphql Mutations.
 */

const mutations = `
  type Mutation {
    login(email: String!, password: String!): User
    signIn(email: String!, password: String!, fullname: String!): User
    logout: User
    documentNew: Document
    documentSaveContent(documentId: ID!, title: String!, description: String!, html: String!, raw: String!): DocumentContent
  }
`;

const schemas = [types, queries, mutations];

export default schemas;
