
const Header = (props) => <h1>{props.course}</h1>

const Content = ({parts}) => (
  <div>
    {parts.map(part => (<Part key= {part.id} part = {part}/>))}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => {
  const total = props.parts.reduce((total, part) => total + part.exercises,0)
  return <p>total of <b>{total}</b> exercises</p>
}


const Course = ({course}) => 
   
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        parts = {course.parts}
      />
    </div>
  
export default Course;