import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTutorialImage } from '../../utils/tutorialImages';

const SLIDE_WIDTH = Dimensions.get('window').width;

type HowToPlayProps = {
  onClose: () => void;
};

const HowToPlay = ({ onClose }: HowToPlayProps) => {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const { mode, theme } = useTheme();
  const { t } = useTranslation();

  const slides = [
    {
      key: 'slide1',
      image: getTutorialImage('slide1', mode),
      text: 'howToPlay.slide1',
    },
    {
      key: 'slide2',
      image: getTutorialImage('slide2', mode),
      text: 'howToPlay.slide2',
    },
    {
      key: 'slide3',
      image: getTutorialImage('slide3', mode),
      text: 'howToPlay.slide3',
    },
  ];

  const onNext = () => {
    if (index < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      onClose();
    }
  };

  const onBack = () => {
    if (index > 0) {
      flatListRef.current?.scrollToIndex({ index: index - 1 });
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setIndex(viewableItems[0].index);
    }
  });

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}
    >
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={[styles.description, { color: theme.secondary }]}>
              {t(item.text)}
            </Text>
          </View>
        )}
        getItemLayout={(_, i) => ({
          length: SLIDE_WIDTH,
          offset: SLIDE_WIDTH * i,
          index: i,
        })}
      />

      <View style={styles.pagination}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === i ? theme.buttonBlue : theme.secondary,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonRow}>
        {index > 0 ? (
          <TouchableOpacity
            onPress={onBack}
            style={[styles.navBtn, { backgroundColor: theme.buttonBlue }]}
          >
            <Ionicons name="arrow-back" size={24} color={theme.iconColor} />
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          accessibilityLabel="HowToPlayNextButton"
          testID="HowToPlayNextButton"
          onPress={onNext}
          style={[styles.navBtn, { backgroundColor: theme.buttonBlue }]}
        >
          <Ionicons
            name={index === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={24}
            color={theme.iconColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 24,
  },
  image: {
    width: '100%' as const,
    height: 360,
  },
  description: {
    marginTop: 16,
    textAlign: 'center' as const,
    fontSize: 15,
  },
  pagination: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    padding: 16,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
});

export default HowToPlay;
