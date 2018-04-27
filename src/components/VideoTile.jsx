//@flow
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export type VideoTileProps = {
    image: string,
    title: string,
    videoPaths: {
        hd: ?string,
        high: ?string,
        low: ?string
    },
};

const styles = StyleSheet.create({
    image: {
        width: 360,
        height: 200
    }
});
const VideoTile = (props: VideoTileProps) => (
    <View>
        <Text>{props.title}</Text>
        <Image source={{ uri: props.image }} style={styles.image} />
    </View>
);

export default VideoTile;
