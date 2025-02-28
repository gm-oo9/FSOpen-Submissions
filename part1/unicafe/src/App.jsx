import { useState } from 'react'
const StatisticsLine = (props) =>{
  return (
      <p>{props.text} {props.value}</p>
    
  );
};

const Statistics = (props) => {
  const {good, neutral, bad, total} = props;
  if (total === 0) {
    return <p>No rypto.getRandomValues(array)feedback given</p>
  }
  return(
    <>
      {/* <p>good {good}</p>
      */}
      <StatisticsLine text="good" value={good} />
      <StatisticsLine text="neutral" value={neutral} />
      <StatisticsLine text="bad" value={bad} />
      <StatisticsLine text="All" value={total} />
      <StatisticsLine text="Average" value={((good-bad) /total).toFixed(1)} />
      <StatisticsLine text="Positive" value={`${((good / total) * 100).toFixed(1)}%`} />
    </>
  )

}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0);
  const total = good + neutral + bad;

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick = {() => setBad(bad + 1)}>bad</button>
      <h1>Statistics</h1>
      <Statistics good={good} bad={bad} neutral={neutral} total={total} />
      
    </div>  )
}

export default App