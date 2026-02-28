interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const exerciseCalculator = (exercisesTotal: Array<number>, goal: number): Result => {
  const periodLength = exercisesTotal.length;
  const trainingDays = exercisesTotal.filter(day => day > 0).length;
  const totalHours = exercisesTotal.reduce((hours, sum) => hours + sum, 0);
  const average = totalHours / periodLength;

  const target = goal;
  const success = average >= target;

  let rating;
  let ratingDescription;

  if (success) {
    rating = 3;
    ratingDescription = "You reached your goal!";
  } else if (average >= (target / 2)) {
    rating = 2;
    ratingDescription = "You were close to reaching your goal.";
  } else {
    rating = 1;
    ratingDescription = "You were not even close to your goal.";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  }
}

interface processValuesExercise {
  exercisesTotal: Array<number>;
  goal: number;
}

const parseArgumentsExercise = (args: string[]): processValuesExercise => {
  if (args.length < 4) {
    throw new Error('Not enough arguments.');
  }

  const exercisesArray = args.filter((a, index) => index >= 3);

  if (exercisesArray.every(value => !isNaN(Number(value)))
    && !isNaN(Number(args[2]))) {
      return {
        goal: Number(args[2]),
        exercisesTotal: exercisesArray.map(ex => Number(ex))
      }
  } else {
    throw new Error('Provided values must be numbers.');
  }
}

try {
  const { goal, exercisesTotal } = parseArgumentsExercise(process.argv);
  console.log(exerciseCalculator(exercisesTotal, goal));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}