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
      <>
        {course.map((part, i) => (
          <div key={part.id}>
          <Header course={part} />
          <Content course={part} />
          <Total course={part} />
          </div>
        ))}
      </>
    )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return <Course course={courses} />
}

export default App