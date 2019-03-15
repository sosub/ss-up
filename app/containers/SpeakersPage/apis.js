/*
 *
 * SpeakersPage apis
 *
 */

import request from 'utils/request';
import { BASE_URL } from 'config/app';

export function fetchSpeakers(token, filters) {
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query getSpeakers (
          $first: Int, 
          $last: Int, 
          $before: String, 
          $after: String, 
          $orderBy: String,
          $search: String
        ) {
          speakers(
            first: $first, 
            last: $last, 
            before: $before, 
            after: $after, 
            orderBy: $orderBy,
            search: $search
          ) {
            edges {
              cursor
              node {
                id
                name
                slug
                description
                image
                videoAmount
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
        search: filters.search,
      }
    })
  })
    .then(
      json => {
        console.log('fetchSpeakers', json);
        if (json.data) {
          return {
            speakers: json.data.speakers.edges.map(item => ({ ...item.node, cursor: item.cursor })),
          };
        }
        throw new Error(json.detail);
      },
    );
}

export function removeSpeaker(token, speakerId) {
  return request(`${BASE_URL}/graphql_token`, {
    method: 'DELETE',
  }).then(json => {
    console.log('removeSpeaker', json);
    if (json.data) {
      return {
        speakerId: json.speaker.id,
      };
    }
    throw new Error(json.detail);
  });
}
