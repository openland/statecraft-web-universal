import * as React from 'react';
import { withBuildingProjectsQuery } from '../api/BuildingProjects';
import { withPage } from '../components/withPage';
import { Header } from '../components/Header';
import { withLoader } from '../components/withLoader';

const Index = withBuildingProjectsQuery(withLoader((props) => {
    console.warn(props);
    return (
        <React.Fragment>
            <Header />

        </React.Fragment>
    );
}));

export default withPage(Index);