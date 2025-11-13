const Header = ({ course }) => {
  return (
    <div>
      <h1>{course.name}</h1>
    </div>
  )
}

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map((part, i) => 
        <Part key={i} part={course.parts[i]} />
      )}
    </div>
  )
}

const Total = ({ course }) => {
  const total = course.parts.reduce((accumulator, currentPart) =>
    accumulator + currentPart.exercises, 0)
  
  return (
    <div>
      <p>Total of {total} exercises</p>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.part.name} {props.part.exercises}</p>
    </div>
  )
}

const Course = ({ course }) => {
    return (
    <div>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
    </div>
    )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App