import * as React from 'react';
import { withPage } from '../components/withPage';
import { Header } from '../components/Header';

const Index = () => {
    return (
        <React.Fragment>
            <Header />
        </React.Fragment>
    );
};

export default withPage(Index);