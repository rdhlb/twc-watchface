import { settingsStorage } from 'settings';

export const initSettingsListening = ({ onChange }) => {
  settingsStorage.addEventListener('change', ({ oldValue, newValue, key }) => {
    if (newValue && oldValue !== newValue) {
      let value;

      try {
        value = JSON.parse(newValue);
      } catch (error) {
        console.log(error);
      }

      onChange({ key, value });
    }
  });
};
