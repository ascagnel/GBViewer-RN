//@flow
import get from 'lodash.get';

export type VideoType = {
    image: string,
    title: string,
    length: string,
    serviceId: string,
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

    return videoList.map(video => {
        return {
            image: get(video, 'image.medium_url'),
            title: get(video, 'name'),
            length: get(video, 'length_seconds'),
            serviceId: get(video, 'id'),
            videoPaths: {
                hd: get(video, 'hd_url'),
                high: get(video, 'high_url'),
                low: get(video, 'low_url')
            },
        }
    });
};
