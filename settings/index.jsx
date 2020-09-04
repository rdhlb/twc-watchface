import { allColors } from './colors';

const options = [
  ['Background Color', 'backgroundColor'],
  ['Accent Color', 'accentColor']
];

function settingsComponent(props) {
  return (
    <Page>
      {options.map(([title, settingsKey]) => (
        <Section title={title}>
          <ColorSelect settingsKey={settingsKey} colors={allColors} />
        </Section>
      ))}
    </Page>
  );
}

registerSettingsPage(settingsComponent);
