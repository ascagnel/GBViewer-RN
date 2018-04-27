//@flow
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ProgressViewIOS, TouchableHighlight } from 'react-native';
import { Video } from 'expo';

import type { VideoType } from '../helpers/parseVideoListResponse';

type VideoTileProps = VideoType & {
    apiKey: string
};

type VideoTileState = {
    isPlaying: boolean,
    videoProgress: 0
};

const styles = StyleSheet.create({
    video: {
        width: "100%",
        height: 212
    }
});

class VideoTile extends Component<VideoTileProps, VideoTileState> {
    constructor(props: VideoTileProps) {
        super(props);

        this.state = {
            isPlaying: false,
            videoProgress: 0
        }

        this.loadProgress = this.loadProgress.bind(this);
        this.startPlayback = this.startPlayback.bind(this);
        this.savePlaybackStatus = this.savePlaybackStatus.bind(this);
    }
    
    loadProgress: () => void;
    startPlayback: () => void;
    savePlaybackStatus: (any) => void;
    player: any;

    componentDidMount() {
        this.loadProgress();
    }

    startPlayback() {
        this.setState({ isPlaying: true });
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

    savePlaybackStatus(playbackStatus: any) {
        if (playbackStatus.positionMillis) {
            fetch(`http://www.giantbomb.com/api/video/save-time/?video_id=${this.props.serviceId}&time_to_save=${playbackStatus.positionMillis/1000}&api_key=${this.props.apiKey}`);
        }
    }

    render() {
        let videoProgress = null;

        if (this.state.videoProgress) {
            const progressPercentage = this.state.videoProgress / parseInt(this.props.length);
            videoProgress = <ProgressViewIOS progress={progressPercentage} progressTintColor="red" />;
        }

        return (
            <View>
                <TouchableHighlight onPress={this.startPlayback}>
                    <View>
                        <Video
                            source={{ uri: `${this.props.video}?api_key=${this.props.apiKey}` }}
                            posterSource={{ uri: this.props.image }}
                            resizeMode="cover"
                            ref={ref => { this.player = ref; }}
                            style={styles.video}
                            shouldPlay={this.state.isPlaying}
                            usePoster
                            useNativeControls
                            progressUpdateIntervalMillis={5000}
                            onPlaybackStatusUpdate={this.savePlaybackStatus}
                        />
                        {videoProgress}
                        <Text>{this.props.title}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

export default VideoTile;
