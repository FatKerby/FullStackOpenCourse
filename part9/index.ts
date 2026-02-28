import express from 'express';
import { calculateBmi } from './bmiCalculator';
//import { exerciseCalculator } from './exerciseCalculator';
const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { height, weight } = req.query;
  let resultsJson;
  if (!height || !weight) {
    resultsJson = { error: "malformatted parameters" };
  } else {
    const bmi = calculateBmi(Number(height), Number(weight));
    resultsJson = { weight, height, bmi };
  }
  res.send(JSON.stringify(resultsJson));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});