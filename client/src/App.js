import React from 'react';
import './App.css';

import Jobs from './components/jobs.component';

const JOB_API_URL = 'http://localhost:3001/jobs'

const mockJobs = [
  {
    title: 'SWE 1',
    company: 'Google'

  },
  {
    title: 'SWE 1',
    company: 'FB'

  },
  {
    title: 'SWE 1',
    company: 'Apple'

  }
]

async function fetchJobs(updateCb) {
  const res = await fetch(JOB_API_URL)
  const json = await res.json();

  //setting value of jobList to this json
  updateCb(json);

  console.log(json);
}

function App() {

  const [jobList, updateJobs] = React.useState([]);

  //this hook is analagous to componentDidMount
  React.useEffect(() => {
    fetchJobs(updateJobs);
  }, [])

  return (
    <div className="App">
      <Jobs jobs={jobList} />
    </div>
  );
}

export default App;
