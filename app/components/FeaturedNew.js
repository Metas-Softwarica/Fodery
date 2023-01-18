import React, {Component, createRef, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Pressable
} from 'react-native';
import { useNavigation } from "@react-navigation/native";

import { constants } from '../configs/constants';

let CurrentSlide = 0;
let IntervalTime = 4000;

export default class Slider extends Component {
  flatList = createRef();

  _goToNextPage = () => {
    if (CurrentSlide >= this.props.dataList.length-1) CurrentSlide = 0;
    if (this.props.dataList.length != 0){
        this.flatList.current.scrollToIndex({
            index: ++CurrentSlide,
            animated: true,
          });
    }
  };

  _startAutoPlay = () => {
    this._timerId = setInterval(this._goToNextPage, IntervalTime);
  };

  _stopAutoPlay = () => {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  };

  componentDidMount() {
    this._stopAutoPlay();
    this._startAutoPlay();
  }

  componentWillUnmount() {
    this._stopAutoPlay();
  }

  // TODO _renderItem()
  _renderItem({item, index}) {
    return <FeaturedItem offer={item}/>;
  }

  // TODO _keyExtractor()
  _keyExtractor(item, index) {
    // console.log(item);
    return index.toString();
  }

  render() {
    return (
      <View>
        <FlatList
          style={{
            flex: 1,
          }}
          data={this.props.dataList}
          keyExtractor={this._keyExtractor.bind(this)}
          renderItem={this._renderItem.bind(this)}
          horizontal={true}
          flatListRef={React.createRef()}
          ref={this.flatList}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}

export function FeaturedItem({offer}) {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    const styles = StyleSheet.create({
        imageItem: {
            height: width/2.27,
            width: width
        }
    });

    const offerPressHandler = () => {
        navigation.navigate('Item', {
            slug: offer.item
        })
    }

    return (
        <Pressable onPress={offerPressHandler}>
            <Image
                style={styles.imageItem}
                source={{
                    uri: constants.baseURL + offer.coverImage,
                }}
                // progressiveRenderingEnabled
            />
        </Pressable>
    );
}