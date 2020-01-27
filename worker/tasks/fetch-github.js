var fetch = require('node-fetch');
var redis = require("redis"),
    client = redis.createClient();


const { promisify } = require('util');
const setAsync = promisify(client.set).bind(client);

const baseURL = 'https://jobs.github.com/positions.json'

//each query by default gives 50 results, or one page, therefor I have to loop through all pages until an empty page is reached to get all jobs

async function fetchGithub() {
    console.log('Fetching github')

    //set result count at arbitrary one so as to not break while loop
    let resultCount = 1, onPage = 0;
    const allJobs = [];


    //fetch all pages
    while (resultCount > 0) {
        const res = await fetch(`${baseURL}?page=${onPage}`)
        const jobs = await res.json();
        allJobs.push(...jobs);
        resultCount = jobs.length
        console.log('got ' + jobs.length + ' jobs')
        onPage++;
    }

    console.log('got ' + allJobs.length + ' jobs')

    //filter algorithm for junior positions only
    const jrJobs = allJobs.filter(job => {
        const jobTitle = job.title.toLowerCase();
        let isJunior = true;

        //algorithm logic
        if (jobTitle.includes('senior') ||
            jobTitle.includes('manager') ||
            jobTitle.includes('sr.')
        ) {
            return false
        }

        return true
    })

    //test filter
    console.log('filtered down to ' + jrJobs.length);

    //place alljobs into redis
    //putting entire allJobs array under one key (for each job board)
    const success = await setAsync('github', JSON.stringify(jrJobs));

    console.log({ success });

}


module.exports = fetchGithub;