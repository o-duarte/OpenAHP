import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const QUERY = gql`
  {
    users {
      id
      email
      fullname
    }
  }
`;

const UserList = props => {
  return (
    <div>
      <ul>
        {props.users.map(user => {
          return (
            <li key={user.email}>
              {user.email} - {user.fullname} - {user.id}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

class Home extends Component {
  render() {
    const { users, loading, error, refetch } = this.props.data;

    if (loading) {
      return <h1>Loading</h1>;
    } else if (error) {
      return <h1>Error</h1>;
    } else {
      return (
        <div>
          <UserList users={users} />

          <button onClick={async () => await refetch()}>Reload</button>
        </div>
      );
    }
  }
}

export default graphql(QUERY)(Home);
