//@flow
import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

import get from 'lodash.get';

import VideoTile from './VideoTile';
import type { VideoTileProps } from './VideoTile';

const getVideoPath = apiKey => `https://www.giantbomb.com/api/videos/?api_key=${apiKey}&format=json`;

type MainMenuProps = {
    apiKey: string,
};

type MainMenuState = {
    videos: Array<any>,
    isLoading: boolean,
    hasLoadingError: boolean,
};

class MainMenu extends Component<MainMenuProps, MainMenuState> {
    constructor(props: MainMenuProps) {
        super(props);

        this.state = {
            videos: [],
            hasLoadingError: false,
            isLoading: true,
        };
        this.loadVideos = this.loadVideos.bind(this);
    }

    loadVideos: () => void;

    componentDidMount() {
        this.loadVideos();
    }

    async loadVideos() {
        let result = null;
        try {
            result = await fetch(getVideoPath(this.props.apiKey));
        } catch (e) {
            console.log('error occurred', e.message);
            this.setState({ hasLoadingError: true, isLoading: false });
            return;
        }

        if (result.ok) {
            const { results: videos } = await result.json();
            this.setState({ videos, isLoading: false });
        } else {
            this.setState({ hasLoadingError: true, isLoading: false });
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            );
        }

        if (this.state.hasLoadingError) {
            return (
                <View>
                    <Text>Could not load videos</Text>
                </View>
            );
        }

        const renderVideos = this.state.videos.map((video) => {
            const image = get(video, 'image.medium_url');
            const title = get(video, 'name');
            const length = get(video, 'length');

            const videoPaths = {
                hd: get(video, 'hd_url'),
                high: get(video, 'high_url'),
                low: get(video, 'low_url')
            };

            return {
                image,
                title,
                videoPaths,
            };
        });

        return (
            <FlatList
                data={renderVideos}
                renderItem={({ item }) => (
                    <VideoTile {...item} />
                )}
                keyExtractor={(item, index) => `video-list-${index}`}
            />
        )
    }
}

export default MainMenu;
