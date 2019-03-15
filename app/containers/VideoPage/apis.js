/*
 *
 * VideosPage apis
 *
 */

import request from 'utils/request';
import { BASE_URL } from 'config/app';

export function fetchVideo(token, videoId) {
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query getVideo ($id: String) {
          video(id: $id) {
            id
            title
            slug
            description
            image
            videoId
            duration
            viSub
            enSub
            viTranscript
            enTranscript
            viewAmount
            isPublished
            createdAt
            createdBy {
              username
            }
            publishedAt
            publishedBy {
              username
            }
            updatedAt
            updatedBy {
              username
            }
            source {
              id
            }
            sponsor {
              id
            }
            speakers {
              id
              name
            }
            categories {
              id
            }
            subcategories {
              id
            }
            tags {
              slug
            }
          }
        }
      `,
      variables: {
        id: videoId,
      }
    })
  })
    .then(json => {
      console.log('fetchVideo', json);
      if (json.data) {
        const video = json.data.video;
        return {
          video: {
            ...video,
            sourceId: video.source.id,
            sponsorId: video.sponsor ? video.sponsor.id : undefined,
            speakerIds: video.speakers.map(item => item.id),
            categoryIds: video.categories.map(item => item.id),
            subcategoryIds: video.subcategories.map(item => item.id),
            tags: video.tags.map(item => item.slug),
            speakerNames: video.speakers.map(item => item.name),
            imageFile: [{
              uid: video.image,
              name: video.image,
              status: 'done',
              url: video.image,
            }],
            viSubFile: [{
              uid: video.viSub,
              name: video.viSub,
              status: 'done',
              url: video.viSub,
            }],
            enSubFile: [{
              uid: video.enSub,
              name: video.enSub,
              status: 'done',
              url: video.enSub,
            }],
          },
        };
      }
      throw new Error(json.detail);
    });
}

export function addVideo(token, video) {
  const newVideo = {
    ...video,
  };

  console.log('addVideo', newVideo);
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation addVideo (
          $slug: String,
          $title: String,
          $description: String,
          $image: String,
          $videoId: String,
          $duration: Int,
          $viSub: String,
          $enSub: String,
          $viTranscript: String,
          $enTranscript: String,
          $sourceId: String,
          $sponsorId: String,
          $speakerIds: [String],
          $categoryIds: [String],
          $subcategoryIds: [String],
          $tags: [String],
        ) {
          createVideo (
            slug: $slug,
            title: $title,
            description: $description,
            image: $image,
            videoId: $videoId,
            duration: $duration,
            viSub: $viSub,
            enSub: $enSub,
            viTranscript: $viTranscript,
            enTranscript: $enTranscript,
            sourceId: $sourceId,
            sponsorId: $sponsorId,
            speakerIds: $speakerIds,
            categoryIds: $categoryIds,
            subcategoryIds: $subcategoryIds,
            tags: $tags,
          ) {
            video {
              id
              title
              slug
              description
              image
              videoId
              duration
              viSub
              enSub
              viTranscript
              enTranscript
              viewAmount
              isPublished
              createdAt
              createdBy {
                username
              }
              publishedAt
              publishedBy {
                username
              }
              updatedAt
              updatedBy {
                username
              }
              source {
                id
              }
              sponsor {
                id
              }
              speakers {
                id
                name
              }
              categories {
                id
              }
              subcategories {
                id
              }
              tags {
                slug
              }
            }
          }
        }
      `,
      variables: {
        slug: video.slug,
        title: video.title,
        description: video.description,
        image: video.image,
        videoId: video.videoId,
        duration: video.duration,
        viSub: video.viSub,
        enSub: video.enSub,
        viTranscript: video.viTranscript,
        enTranscript: video.enTranscript,
        sourceId: video.sourceId,
        sponsorId: video.sponsorId,
        speakerIds: video.speakerIds,
        categoryIds: video.categoryIds,
        subcategoryIds: video.subcategoryIds,
        tags: video.tags,
      }
    })
  })
    .then(json => {
      console.log('addVideo', json);
      if (json.data && json.data.createVideo) {
        const video = json.data.createVideo.video;
        return {
          video: {
            ...video,
            sourceId: video.source.id,
            sponsorId: video.sponsor ? video.sponsor.id : undefined,
            speakerIds: video.speakers.map(item => item.id),
            categoryIds: video.categories.map(item => item.id),
            subcategoryIds: video.subcategories.map(item => item.id),
            tags: video.tags.map(item => item.slug),
            speakerNames: video.speakers.map(item => item.name),
            imageFile: [{
              uid: video.image,
              name: video.image,
              status: 'done',
              url: video.image,
            }],
            viSubFile: [{
              uid: video.viSub,
              name: video.viSub,
              status: 'done',
              url: video.viSub,
            }],
            enSubFile: [{
              uid: video.enSub,
              name: video.enSub,
              status: 'done',
              url: video.enSub,
            }],
          },
        };
      }
      throw new Error(json.detail || json.errors[0].message);
    });
}

export function updateVideo(token, video) {
  const newVideo = {
    ...video,
  };

  console.log('updateVideo', newVideo);
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation updateVideo (
          $id: String,
          $slug: String,
          $title: String,
          $description: String,
          $image: String,
          $videoId: String,
          $duration: Int,
          $viSub: String,
          $enSub: String,
          $viTranscript: String,
          $enTranscript: String,
          $sourceId: String,
          $sponsorId: String,
          $speakerIds: [String],
          $categoryIds: [String],
          $subcategoryIds: [String],
          $tags: [String],
        ) {
          updateVideo (
            id: $id,
            slug: $slug,
            title: $title,
            description: $description,
            image: $image,
            videoId: $videoId,
            duration: $duration,
            viSub: $viSub,
            enSub: $enSub,
            viTranscript: $viTranscript,
            enTranscript: $enTranscript,
            sourceId: $sourceId,
            sponsorId: $sponsorId,
            speakerIds: $speakerIds,
            categoryIds: $categoryIds,
            subcategoryIds: $subcategoryIds,
            tags: $tags,
          ) {
            video {
              id
              title
              slug
              description
              image
              videoId
              duration
              viSub
              enSub
              viTranscript
              enTranscript
              viewAmount
              isPublished
              createdAt
              createdBy {
                username
              }
              publishedAt
              publishedBy {
                username
              }
              updatedAt
              updatedBy {
                username
              }
              source {
                id
              }
              sponsor {
                id
              }
              speakers {
                id
                name
              }
              categories {
                id
              }
              subcategories {
                id
              }
              tags {
                slug
              }
            }
          }
        }
      `,
      variables: {
        id: video.id,
        slug: video.slug,
        title: video.title,
        description: video.description,
        image: video.image,
        videoId: video.videoId,
        duration: video.duration,
        viSub: video.viSub,
        enSub: video.enSub,
        viTranscript: video.viTranscript,
        enTranscript: video.enTranscript,
        sourceId: video.sourceId,
        sponsorId: video.sponsorId,
        speakerIds: video.speakerIds,
        categoryIds: video.categoryIds,
        subcategoryIds: video.subcategoryIds,
        tags: video.tags,
      }
    })
  })
    .then(json => {
      console.log('updateVideo', json);
      if (json.data && json.data.updateVideo) {
        const video = json.data.updateVideo.video;
        return {
          video: {
            ...video,
            sourceId: video.source.id,
            sponsorId: video.sponsor ? video.sponsor.id : undefined,
            speakerIds: video.speakers.map(item => item.id),
            categoryIds: video.categories.map(item => item.id),
            subcategoryIds: video.subcategories.map(item => item.id),
            tags: video.tags.map(item => item.slug),
            speakerNames: video.speakers.map(item => item.name),
            imageFile: [{
              uid: video.image,
              name: video.image,
              status: 'done',
              url: video.image,
            }],
            viSubFile: [{
              uid: video.viSub,
              name: video.viSub,
              status: 'done',
              url: video.viSub,
            }],
            enSubFile: [{
              uid: video.enSub,
              name: video.enSub,
              status: 'done',
              url: video.enSub,
            }],
          },
        };
      }
      throw new Error(json.detail || json.errors[0].message);
    });
}
