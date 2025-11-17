const Course = ({ course }) => {
    return (
      <>
        {course.map((part) => (
          <div key={part.id}>
          <Header course={part} />
          <Content course={part} />
          <Total course={part} />
          </div>
        ))}
      </>
    )
}

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

export default Course