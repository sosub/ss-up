/*
 *
 * SourcesPage apis
 *
 */

import request from 'utils/request';
import { BASE_URL } from 'config/app';

export function fetchSources(token, filters) {
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query getSources (
          $first: Int, 
          $last: Int, 
          $before: String, 
          $after: String, 
          $orderBy: String,
          $search: String
        ) {
          sources(
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
        console.log('fetchSources', json);
        if (json.data) {
          return {
            sources: json.data.sources.edges.map(item => ({ ...item.node, cursor: item.cursor })),
          };
        }
        throw new Error(json.detail);
      },
    );
}

export function removeSource(token, sourceId) {
  return request(`${BASE_URL}/graphql_token`, {
    method: 'DELETE',
  }).then(json => {
    console.log('removeSource', json);
    if (json.data) {
      return {
        sourceId: json.source.id,
      };
    }
    throw new Error(json.detail);
  });
}
