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

try {
  console.log(exerciseCalculator([3, 0, 2, 4.5, 0, 3, 1], 2));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}