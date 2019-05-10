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

  type Criteria {
    name: String
    matrix: [[Float]]
    subCriteria: [Criteria]
  }

  type ahpProblem {
    id: ID
    name: String
    goal: String
    rootMatrix: [[Float]]
    alternatives: [String]
    priorityMethod: Int
    consistencyMethod: Int
    errorMeasure: Int
    criteria: [Criteria]
    rawCriteria : String
    owner: User
    result: Result
    sensitivity: Sensitivity
    probabilistic: Probabilistic
    generator: Int
    beta: Float
    preserveRank: Boolean
    updatedAt: String
    createdAt: String
    lastResolutionAt: String
  }

  type Probabilistic{
    id: ID
    alternatives: [ProbabilisticAlternative]
  }

  type ProbabilisticAlternative{
    mean: Float
    median: Float
    q1: Float
    q2: Float
    q3: Float
    min: Float
    max: Float
    name: String
  }

  type ResultCriteria{
    name: String
    ranking: [[Float]]
    subCriteria: [ResultCriteria]
  }

  type Result {
    id: ID
    name: String
    goal: String
    ranking: [Float]    
    alternatives: [String]
    criteria: [ResultCriteria]
    raw: String
    
  }

  type SensitivityCriteria{
    name: String
    rankReversal: [[Float]]
    subCriteria: [SensitivityCriteria]
    weigths: [Float]
  }

  type Sensitivity {
    id: ID
    name: String
    goal: String  
    alternatives: [String]
    criteria: [SensitivityCriteria]
    raw: String
    
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
    currentUserProblems(statusList:[String]): [ahpProblem]!
    currentUserSingleProblem(problemId: String): ahpProblem
    result(resultId: String): Result
    sensitivity(sensitivityId: String): Sensitivity
    probabilistic(probabilisticId: String): Probabilistic
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
    problemSave(problemId: String!, rawData: String!): ahpProblem 
    problemNew(name: String!): ahpProblem
    problemDelete(problemId: String!): ahpProblem
    updateMethods(problemId: String! ,consistency: Int, error: Int, priority: Int, generator: Int,  beta: Float, order: Boolean): ahpProblem
  }
`;

const schemas = [types, queries, mutations];

export default schemas;
