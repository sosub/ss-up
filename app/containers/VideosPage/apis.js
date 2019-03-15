/*
 *
 * VideosPage apis
 *
 */

import request from 'utils/request';
import { BASE_URL } from 'config/app';

export function fetchVideos(token, filters) {
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query getVideos (
          $first: Int, 
          $last: Int, 
          $before: String, 
          $after: String, 
          $orderBy: String,
          $creator: String,
          $sponsor: String,
          $source: String,
          $search: String,
          $isPublished: Boolean,
        ) {
          videos(
            first: $first, 
            last: $last, 
            before: $before, 
            after: $after, 
            orderBy: $orderBy,
            createdBy: $creator,
            sponsor: $sponsor,
            source: $source,
            search: $search,
            isPublished: $isPublished,
          ) {
            edges {
              cursor
              node {
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
                  name
                }
                sponsor {
                  name
                }
                speakers {
                  name
                }
                categories {
                  name
                }
                tags {
                  slug
                }
              }
            }
          }
        }
      `,
      variables: {
        orderBy: filters.orderBy,
        ...(filters.after ? {
          first: filters.limit,
          after: filters.after,
        } : (filters.before ? {
          last: filters.limit,
          before: filters.before,
        } : {
          first: filters.limit
        })),
        ...(filters.creator ? {
          creator: filters.creator
        } : {}),
        ...(filters.sponsor ? {
          sponsor: filters.sponsor
        } : {}),
        ...(filters.source ? {
          source: filters.source
        } : {}),
        ...(filters.search ? {
          search: filters.search
        } : {}),
        ...(filters.published ? {
          isPublished: filters.published == "1"
        } : {}),
      }
    })
  })
    .then(
      json => {
        console.log('fetchVideos', json);
        if (json.data) {
          return {
            videos: json.data.videos.edges.map(item => ({ ...item.node, cursor: item.cursor })),
          };
        }
        throw new Error(json.detail);
      },
    );
}

export function publishVideo(token, videoId) {
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation publishVideo (
          $id: String,
        ) {
          publishVideo (
            id: $id,
          ) {
            video {
              id
              title
              slug
              isPublished
              publishedAt
              publishedBy {
                username
              }
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
      console.log('publishVideo', json);
      if (json.data && json.data.publishVideo) {
        return
      }
      throw new Error(json.detail || json.errors[0].message);
    });
}
