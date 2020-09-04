const COLORS = {
  'fb-aqua': '#3BF7DE',
  'fb-black': '#000000',
  'fb-blue': '#3182DE',
  'fb-cerulean': '#8080FF',
  'fb-cyan': '#14D3F5',
  'fb-dark-gray': '#505050',
  'fb-extra-dark-gray': '#303030',
  'fb-green': '#00A629',
  'fb-green-press': '#134022',
  'fb-indigo': '#5B4CFF',
  'fb-lavender': '#BCD8F8',
  'fb-light-gray': '#A0A0A0',
  'fb-lime': '#B8FC68',
  'fb-magenta': '#F80070',
  'fb-mint': '#5BE37D',
  'fb-orange': '#FC6B3A',
  'fb-peach': '#FFCC33',
  'fb-pink': '#F83478',
  'fb-plum': '#A51E7C',
  'fb-purple': '#BD4EFC',
  'fb-red': '#F83C40',
  'fb-slate': '#7090B5',
  'fb-slate-press': '#1B2C40',
  'fb-violet': '#D828B8',
  'fb-white': '#FFFFFF',
  'fb-yellow': '#E4FA3C',
  'fb-yellow-press': '#394003'
};

const getAllColors = (colors) => Object.keys(colors).map((key) => ({ value: key, color: colors[key] }));

export const allColors = getAllColors(COLORS);
