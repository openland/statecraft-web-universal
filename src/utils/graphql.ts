import { ChildProps, QueryProps } from 'react-apollo';
import { SingletonRouter } from 'next/router';

export type NotNullableChildProps<TResult> = ChildProps<{}, TResult> & NotNullableDataProps<TResult>;
export type NotNullableDataProps<TResult> = { data: QueryProps & TResult };
export type GraphQLRoutedComponentProps<TResult> = { router: SingletonRouter } & NotNullableChildProps<TResult>;