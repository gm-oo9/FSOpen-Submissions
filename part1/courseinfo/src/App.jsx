const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  const Content = ({ course }) => {
    const {name: course_name, parts} = course;

    const partNames = parts.map(part => part.name);
    const exerciseCounts = parts.map(part => part.exercises);
    console.log(partNames.length, exerciseCounts.length);
    
    // Now destructure from these arrays, They cannot be deconstructed directly
    const [part1, part2, part3] = partNames;
    const [exercises1, exercises2, exercises3] = exerciseCounts;


    /*For Loop approach for total
    const exercises = [exercises1, exercises2, exercises3];
    let sum = 0
  
    for (let i = 0; i < exercises.length; i++) {
          sum += exercises[i];
        }*/


    const sum = exerciseCounts.reduce((total, count) => total + count, 0);
    return (
    
    
    <div>
      <h1>{course_name}</h1>
      {console.log("Header done!")}
      <p>
      {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      {console.log("Content done!")}
      <p>Number of exercises {sum}</p>
      {console.log("Footer done!")}
    </div>
    );
  };


  

return (

      <Content course={course} />
  );
};

export default App;