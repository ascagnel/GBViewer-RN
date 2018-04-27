//@flow
import get from 'lodash.get';

export type VideoType = {
    image: string,
    title: string,
    length: string,
    serviceId: string,
    video: string,
    videoPaths: {
        hd: string,
        high: string,
        low: string,
    },
};

export default function parseVideoListResponse(videoList: Array<any>): Array<VideoType> {
    if (!Array.isArray(videoList)) {
        return [];
    }

    return videoList.slice(0,10).map(video => {
        // TODO set up quality handling
        const hd = get(video, 'hd_url');
        const high = get(video, 'high_url');
        const low = get(video, 'low_url');

        let videoPath = hd || high || low;
        return {
            image: get(video, 'image.medium_url'),
            title: get(video, 'name'),
            length: get(video, 'length_seconds'),
            serviceId: get(video, 'id'),
            video: videoPath,
            videoPaths: {
                hd,
                high,
                low
            },
        }
    });
};
