import document from 'document';
import { display } from 'display';
import { vibration } from 'haptics';

export const ROUTES = {
  calendar: {
    loadJs: () => import('./calendarView'),
    guiPath: './resources/calendarView.gui'
  }
};

export const navigate = ({ loadJs, guiPath }, back, cleanUpView) => () => {
  vibration.start('bump');
  cleanUpView();

  loadJs()
    .then(({ initView }) => {
      document.replaceSync(guiPath);
      initView(back);
      display.poke();
    })
    .catch((e) => console.log(e));
};
