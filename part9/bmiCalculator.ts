const calculateBmi = (height: number, weight: number) => {
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

try {
  console.log(calculateBmi(180, 74));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}