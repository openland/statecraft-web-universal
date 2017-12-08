import { graphql } from 'react-apollo';
import { DocumentNode } from 'graphql';
import { withRouter, SingletonRouter } from 'next/router';
import { GraphQLRoutedComponentProps } from './graphql';

export function graphqlRouted<TResult>(document: DocumentNode) {
  return function (component: React.ComponentType<GraphQLRoutedComponentProps<TResult>>): React.ComponentType<{}> {
    let qlWrapper = graphql<TResult, { router: SingletonRouter }, GraphQLRoutedComponentProps<TResult>>(document, {
      options: (props: { router: SingletonRouter }) => {
        return {
          variables: {
            ...props.router.query
          }
        };
      }
    });

    return withRouter(qlWrapper(component));
  };
}