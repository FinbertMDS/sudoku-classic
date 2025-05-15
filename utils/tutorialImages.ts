import { ColorSchemeName } from 'react-native';

export const tutorialImages = {
  slide1: {
    light: require('../../assets/tutorial/tutorial1.png'),
    dark: require('../../assets/tutorial/tutorial1_dark.png'),
  },
  slide2: {
    light: require('../../assets/tutorial/tutorial2.png'),
    dark: require('../../assets/tutorial/tutorial2_dark.png'),
  },
  slide3: {
    light: require('../../assets/tutorial/tutorial3.png'),
    dark: require('../../assets/tutorial/tutorial3_dark.png'),
  },
  slide4: {
    light: require('../../assets/tutorial/tutorial4.png'),
    dark: require('../../assets/tutorial/tutorial4_dark.png'),
  },
};

export const getTutorialImage = (
  slide: keyof typeof tutorialImages,
  mode: ColorSchemeName,
) => {
  const fallbackMode = mode === 'dark' ? 'dark' : 'light';
  return tutorialImages[slide][fallbackMode];
};
