import { gql } from 'react-apollo';
import { graphqlRouted } from '../utils/graphqlRouted';
// import { User } from './User';
// import { Project } from './Project';
// Data structures

export interface Account {
    id: string;
    name: string;
    city?: string;
    readAccess: Boolean;
    writeAccess: Boolean;
    generation: number;
}

export interface AccountResponse {
    account: Account;
    // me?: User;
    // projects: [Project];
}

// Queries

const QueryCity = gql`
   query {
     account {
       id
       name
       city
       readAccess
       writeAccess
       generation
     }
     me {
       id
       name
       firstName
       lastName
       picture
     }
     projects {
      id
      name
      slug
     }
   }
 `;

export const withAccountQuery = graphqlRouted<AccountResponse>(QueryCity);