import gql from 'graphql-tag';

/*
 * Mutations.
 */

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
    }
  }
`;

export const LOGOUT = gql`
  mutation {
    logout {
      id
    }
  }
`;

export const SIGNIN = gql`
  mutation signIn($email: String!, $password: String!, $fullname: String!){
    signIn(email: $email, password: $password, fullname: $fullname) {
      id
    }
  }
`;


export const DOCUMENT_SAVE_CONTENT = gql`
  mutation saveContent(
    $documentId: ID!
    $title: String!
    $description: String!
    $html: String!
    $raw: String!
  ) {
    documentSaveContent(
      documentId: $documentId
      title: $title
      description: $description
      html: $html
      raw: $raw
    ) {
      id
      version
      description
      createdAt
      updatedAt
    }
  }
`;

export const DOCUMENT_NEW = gql`
  mutation {
    documentNew {
      id
    }
  }
`;

/*
 * Queries.
 */

export const CURRENT_USER = gql`
  query {
    currentUser {
      id
      fullname
      email
      image
    }
  }
`;

export const CURRENT_USER_DOCUMENTS = gql`
  query currentUserDocuments($statusList: [String]) {
    currentUserDocuments(statusList: $statusList) {
      id
      title
      description
      updatedAt
      owner {
        fullname
      }
      content {
        id
        version
      }
    }
  }
`;

export const CURRENT_USER_SINGLE_DOCUMENT = gql`
  query currentUserSingleDocument($documentId: ID!) {
    currentUserSingleDocument(documentId: $documentId) {
      id
      title
      description
      content {
        id
        html
        raw
      }
    }
  }
`;

export const CURRENT_USER_SINGLE_PROBLEM= gql`
  query currentUserSingleProblem($problemId: String) {
    currentUserSingleProblem(problemId: $problemId) {
      id
      name
      goal
      rootMatrix
      alternatives
      priorityMethod
      consistencyMethod
      errorMeasure
      generator
      beta
      preserveRank
      result {
        id
      }
      sensitivity {
        id
      }
      probabilistic {
        id
      }
      rawCriteria
      criteria {
        name
        matrix
        subCriteria {
          name
          matrix
          subCriteria {
            name
            matrix
             subCriteria{
              name
              matrix
               subCriteria{
                name
                matrix
                 subCriteria{
                  name
                  matrix
                   subCriteria{
                    name
                    matrix
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const CURRENT_USER_PROBLEMS = gql`
  query currentUserProblems($statusList: [String]) {
    currentUserProblems(statusList: $statusList) {
      id
      name
      goal
      updatedAt
      lastResolutionAt
      owner {
        fullname
      }
    }
  }
`;

export const PROBLEM_SAVE  = gql`
  mutation ProblemSave($problemId: String!, $rawData: String!) {
    problemSave(problemId: $problemId, rawData: $rawData) {
      id
    }
  }
`;

export const PROBLEM_NEW  = gql`
  mutation ProblemNew($name: String!) {
    problemNew(name: $name) {
      id
    }
  }
`;
export const PROBLEM_DELETE  = gql`
  mutation ProblemDelete($problemId: String!) {
    problemDelete(problemId: $problemId) {
      id
    }
  }
`;

export const DOCUMENT_DELETE  = gql`
  mutation documentDelete($documentId: String!) {
    documentDelete(documentId: $documentId) {
      id
    }
  }
`;

export const RESULT  = gql`
  query result($resultId: String!) {
    result(resultId: $resultId) {
      raw
    }
  }
`;
export const SENSITIVITY  = gql`
  query sensitivity($sensitivityId: String!) {
    sensitivity(sensitivityId: $sensitivityId) {
      raw
    }
  }
`;

export const PROBABILISTIC = gql`
  query probabilistic($probabilisticId: String!){
    probabilistic(probabilisticId: $probabilisticId){
      alternatives{
        mean
        median
        q1
        q2
        q3
        min
        max
        name
      }
    }
  }
`;


export const PARAMS  = gql`
  query currentUserSingleProblem($problemId: String!) {
    currentUserSingleProblem(problemId: $problemId) {
      priorityMethod
      consistencyMethod
      errorMeasure
    }
  }
`;
export const UPDATE_METHODS  = gql`
  mutation updateMethods($problemId: String!, $consistency: Int, $error: Int, $priority: Int, $generator: Int, $beta: Float, $order: Boolean) {
    updateMethods(problemId: $problemId, consistency:$consistency, error:$error, priority:$priority, generator:$generator, beta:$beta, order:$order) {
      priorityMethod
      consistencyMethod
      errorMeasure
    }
  }
`;
