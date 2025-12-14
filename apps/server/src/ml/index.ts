import * as tf from '@tensorflow/tfjs-node';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

export let trainingModel: any = null;

// load CSV data
export function loadData(csvPath: string) {
  return new Promise(resolve => {
    const data: any = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', row => {
        data.push(row);
      })
      .on('end', () => {
        console.log(`Loaded ${data.length} rows`);
        resolve(data);
      });
  });
}

export function encodeWeather(weather: string): number {
  switch (weather.toLowerCase()) {
    case 'rain':
      return 1;
    case 'snow':
      return 2;
    case 'sunny':
      return 3;
    default:
      return 0;
  }
}

export async function trainModel(data: any) {
  const xs = data.map((d: any) => [
    parseFloat(d.hour),
    parseFloat(d.weekday),
    parseFloat(d.temp),
    encodeWeather(d.weather),
    parseFloat(d.price),
    parseFloat(d.location_lat),
    parseFloat(d.location_lng),
  ]);

  const ys = data.map((d: any) => parseInt(d.occupied));

  const xsTensor = tf.tensor2d(xs);
  const ysTensor = tf.tensor2d(ys, [ys.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [7], units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({
    optimizer: tf.train.adam(),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });

  console.log('Start training...');
  await model.fit(xsTensor, ysTensor, {
    epochs: 50,
    batchSize: 64,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch: any, logs: any) => {
        console.log(
          `Epoch ${epoch + 1}: loss=${logs.loss.toFixed(4)}, val_loss=${logs.val_loss.toFixed(4)}`
        );
      },
    },
  });

  // save the model
  const modelPath = path.join(__dirname, '../../parking_model');
  await model.save(`file://${modelPath}`);
  console.log(`Model saved to: ${modelPath}`);

  trainingModel = model;

  return model;
}

export function getModel() {
  return trainingModel;
}
