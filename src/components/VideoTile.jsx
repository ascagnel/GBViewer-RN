//@flow
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ProgressViewIOS } from 'react-native';

import type { VideoType } from '../helpers/parseVideoListResponse';

type VideoTileProps = VideoType & {
    apiKey: string
};

type VideoTileState = {
    videoProgress: 0
};

const styles = StyleSheet.create({
    image: {
        resizeMode: 'cover',
        width: "100%",
        height: 212
    }
});

class VideoTile extends Component<VideoTileProps, VideoTileState> {
    constructor(props: VideoTileProps) {
        super(props);

        this.state = {
            videoProgress: 0
        }

        this.loadProgress = this.loadProgress.bind(this);
    }
    
    loadProgress: () => void;

    componentDidMount() {
        this.loadProgress();
    }

    async loadProgress() {
        let response = null;

        const { apiKey } = this.props;
        let { serviceId } = this.props;

        try {
            serviceId = parseInt(serviceId);
        } catch (e) {
            return;
        }

        try {
            response = await fetch(`http://www.giantbomb.com/api/video/get-saved-time/?video_id=${serviceId}&api_key=${apiKey}`);
        } catch (e) {
        }

        if (response && response.ok) {
            const result = await response.json();

            if (result.savedTime > 0) {
                this.setState({ videoProgress: result.savedTime });
            }
        }
    }

    render() {
        let videoProgress = null;

        if (this.state.videoProgress) {
            const progressPercentage = this.state.videoProgress / parseInt(this.props.length);
            videoProgress = <ProgressViewIOS progress={progressPercentage} progressTintColor="red" />
        }

        return (
            <View>
                <Image source={{ uri: this.props.image }} style={styles.image} />
                {videoProgress}
                <Text>{this.props.title}</Text>
            </View>
        );
    }
}

export default VideoTile;
