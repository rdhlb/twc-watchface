import document from 'document';

export function processWeatherData(data) {
  renderCity(data.city);
  renderCurrentWeather(data.temp, data.description);
  renderHighLowTemp(data.temp_min, data.temp_max);
}

const cityNode = document.getElementById('location');
const currentWeatherNode = document.getElementById('currTemp');
const highLowTempNode = document.getElementById('highLowTemp');

const renderCity = (city) => {
  cityNode.text = city;
};

const renderCurrentWeather = (temp, description) => {
  currentWeatherNode.text = `${temp.toFixed(0)}° ${description.charAt(0).toUpperCase() + description.slice(1)}`;
};

const renderHighLowTemp = (min: number, max: number) => {
  highLowTempNode.text = `H:${max.toFixed(0)}° L:${min.toFixed(0)}°`;
};
