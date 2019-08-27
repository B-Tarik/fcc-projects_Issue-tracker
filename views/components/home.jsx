import React, {useState} from 'react';

import SubmitIssue from './submitIssue.jsx';
import Issues from './issues.jsx';
import AppTitle from './common/appTitle.jsx';

const Home = () => {

  const [issues, setIssues] = useState([]);
  
  return (
    <div className="inner-container">
      
      <AppTitle title={<h1>Issue Tracker</h1>} />
      <SubmitIssue issues={issues} setIssues={setIssues} />
      <Issues issues={issues} setIssues={setIssues} />
      
    </div>
  );
  
}

export default Home;