//@flow
import get from 'lodash.get';

export type Video = {
    image: string,
    title: string,
    length: number,
    serviceId: number,
    videoPaths: {
        hd: string,
        high: string,
        low: string,
    },
};

export default function parseVideoListResponse(videoList: Array<any>): Array<Video> {
    return videoList.map(video => ({
        image: get(video, 'image.medium_url'),
        title: get(video, 'name'),
        length: get(video, 'length_seconds'),
        serviceId: get(video, 'id'),
        videoPaths: {
            hd: get(video, 'hd_url'),
            high: get(video, 'high_url'),
            low: get(video, 'low_url')
        },
    }));
};
