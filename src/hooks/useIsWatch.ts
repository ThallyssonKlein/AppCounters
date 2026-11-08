import {useWindowDimensions} from 'react-native';

// Smartwatch displays are well under 300dp wide; phones start around 320dp.
const WATCH_MAX_WIDTH = 300;

export function useIsWatch() {
  const {width} = useWindowDimensions();
  return width < WATCH_MAX_WIDTH;
}
