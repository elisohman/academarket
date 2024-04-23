//import React from 'react';
//import logo from './logo.svg';
import './dashboard.scss';
import button from '../../components/button/Button';
import PageWrapper from '../../components/pagewrapper/PageWrapper';
const monkey = './assets/images/bg-monkeys.jpg';

const Dashboard: React.FC = () => {
  
  return (
    <PageWrapper>
      <div className="dashboard-container size-full bg-primary-color flex flex-row gap-0.5 justify-center items-center gap-y-2">
        <p className="">Dashboard</p>
        <p className="">välkommen bror</p>

        
      </div>
    </PageWrapper>
  );
}



export default Dashboard;
