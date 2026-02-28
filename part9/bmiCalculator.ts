export const calculateBmi = (height: number, weight: number) => {
  if (weight <= 0) {
    return "Error. Weight must be greater than 0.";
  }
  if (height <= 0) {
    return "Error. Height must be greater than 0.";
  }
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters*heightInMeters);
  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi < 25) {
    return "Normal";
  } else if (bmi < 30) {
    return "Overweight";
  } else {
    return "Obese";
  }
}

interface processValuesBmi {
  height: number;
  weight: number;
}

const parseArgumentsBmi = (args: string[]): processValuesBmi => {
  if (args.length < 4) throw new Error('Not enough arguments.');
  if (args.length > 4) throw new Error('Too many arguments.');
  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    }
  } else {
    throw new Error('Values provided are not numbers.');
  }
}

try {
  const { height, weight } = parseArgumentsBmi(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}