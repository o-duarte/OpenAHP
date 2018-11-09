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
  query currentUserSingleProblem($documentId: ID!) {
    currentUserSingleProblem(documentId: $documentId) {
      id
      name
      goal
      criteria{
        subCriteria
        matrix
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
      owner {
        fullname
      }
    }
  }
`;