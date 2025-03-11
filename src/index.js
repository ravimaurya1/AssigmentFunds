/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useRef} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';

import styles from './style';
import CAROUSEL_DATA from './CraouselData';

function CarouselCard({item, isVisible}) {
  const titleAnimation = useRef(new Animated.Value(0)).current;
  const descriptionAnimation = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (isVisible) {
      Animated.stagger(300, [
        Animated.spring(titleAnimation, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(descriptionAnimation, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      titleAnimation.setValue(0);
      descriptionAnimation.setValue(0);
    }
  }, [isVisible]);

  return (
    <View style={[styles.card, {backgroundColor: item.background.value}]}>
      {item.videoUrl && !videoError && (
        <>
          <Video
            ref={videoRef}
            source={item.videoUrl}
            style={styles.backgroundVideo}
            repeat
            muted
            resizeMode="cover"
            paused={!isVisible}
            onError={error => {
              console.warn('Video loading error:', error);
              setVideoError(true);
            }}
            onLoad={() => setIsLoading(false)}
            onLoadStart={() => setIsLoading(true)}
            preload="auto"
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
          />
          {isLoading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )}
        </>
      )}
      <View style={styles.contentOverlay}>
        <Animated.Text
          style={[
            styles.title,
            {
              transform: [
                {
                  translateY: titleAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
              opacity: titleAnimation,
            },
          ]}>
          {item.title}
        </Animated.Text>

        <Animated.Text
          style={[
            styles.description,
            {
              transform: [
                {
                  translateY: descriptionAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
              opacity: descriptionAnimation,
            },
          ]}>
          {item.description}
        </Animated.Text>

        <TouchableOpacity
          style={[
            styles.cta,
            {backgroundColor: item.ctaStyle.backgroundColor},
          ]}>
          <Text style={[styles.ctaText, {color: item.ctaStyle.color}]}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Carousel() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const SCREEN_HEIGHT = Dimensions.get('window').height;

  const renderItem = ({item, index}) => (
    <CarouselCard item={item} isVisible={currentIndex === index} />
  );

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={'#000'}
      />
      <FlatList
        ref={flatListRef}
        data={CAROUSEL_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
        removeClippedSubviews={false}
      />
    </View>
  );
}

export default Carousel;
