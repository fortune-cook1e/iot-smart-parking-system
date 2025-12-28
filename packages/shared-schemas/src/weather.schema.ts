export const mappingWeatherCode = (
  code: number
): 'sunny' | 'rainy' | 'cloudy' | 'snowy' | 'windy' => {
  if (code === 0) {
    return 'sunny';
  } else if (code === 1 || code === 2 || code === 3) {
    return 'cloudy';
  } else if (
    code === 61 ||
    code === 63 ||
    code === 65 ||
    code === 66 ||
    code === 67 ||
    code === 80 ||
    code === 81 ||
    code === 82
  ) {
    return 'rainy';
  } else if (
    code === 71 ||
    code === 73 ||
    code === 75 ||
    code === 77 ||
    code === 85 ||
    code === 86
  ) {
    return 'snowy';
  } else {
    return 'windy';
  }
};
