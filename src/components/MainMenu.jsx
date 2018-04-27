//@flow
import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

import parseVideoListResponse from '../helpers/parseVideoListResponse';

import VideoTile from './VideoTile';

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

        const renderVideos = parseVideoListResponse(this.state.videos);

        return (
            <FlatList
                data={renderVideos}
                renderItem={({ item }) => (
                    <VideoTile {...item} apiKey={this.props.apiKey} />
                )}
                keyExtractor={(item, index) => `video-list-${index}`}
            />
        )
    }
}

export default MainMenu;
