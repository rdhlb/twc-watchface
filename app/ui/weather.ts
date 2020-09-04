import document from 'document';
import { capitalizeFirstLetter } from '../utils';

class WeatherComponent {
  cityNode: Element;
  currentWeatherNode: Element;
  highLowTempNode: Element;

  constructor() {
    this.cityNode = document.getElementById('location');
    this.currentWeatherNode = document.getElementById('currTemp');
    this.highLowTempNode = document.getElementById('highLowTemp');
  }

  render = ({ location, temp, description, forecast }) => {
    this.cityNode.text = location;
    this.currentWeatherNode.text = `${temp.toFixed(0)}° ${capitalizeFirstLetter(description)}`;
    this.highLowTempNode.text = `H:${forecast.min.toFixed(0)}° L:${forecast.max.toFixed(0)}°`;
  };
}

export default WeatherComponent;
