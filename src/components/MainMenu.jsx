//@flow
import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, StatusBar, StyleSheet, Platform, SafeAreaView } from 'react-native';

import parseVideoListResponse from '../helpers/parseVideoListResponse';

import VideoTile from './VideoTile';

const getVideoPath = apiKey => `https://www.giantbomb.com/api/videos/?api_key=${apiKey}&format=json`;

type MainMenuProps = {
    apiKey: string,
};

type MainMenuState = {
    videos: Array<any>,
    isLoading: boolean,
    hasLoaded: boolean,
    hasLoadingError: boolean,
};

const styles = StyleSheet.create({
    appBar: {
        height: Platform.OS === 'ios' ? 44 : 56
    }
});

class MainMenu extends Component<MainMenuProps, MainMenuState> {
    constructor(props: MainMenuProps) {
        super(props);

        this.state = {
            videos: [],
            hasLoaded: false,
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
        this.setState({ isLoading: true });
        let result = null;
        try {
            result = await fetch(getVideoPath(this.props.apiKey));
        } catch (e) {
            console.log('error occurred', e.message);
            this.setState({ hasLoadingError: true, isLoading: false, hasLoaded: true });
            return;
        }

        if (result.ok) {
            const { results: videos } = await result.json();
            this.setState({ videos, isLoading: false, hasLoaded: true });
        } else {
            this.setState({ hasLoadingError: true, isLoading: false, hasLoaded: true });
        }
    }

    render() {
        if (!this.state.hasLoaded) {
            return (
                <View>
                    <ActivityIndicator />
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
            <SafeAreaView>
                <View style={styles.appBar}>
                    <Text>GB Viewer-RN</Text>
                </View>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this.loadVideos}
                        />
                    }
                    data={renderVideos}
                    renderItem={({ item }) => (
                        <VideoTile {...item} apiKey={this.props.apiKey} />
                    )}
                    keyExtractor={(item, index) => `video-list-${index}`}
                />
            </SafeAreaView>
        )
    }
}

export default MainMenu;
