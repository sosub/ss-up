/*
 *
 * SourcesPage apis
 *
 */

import request from 'utils/request';
import { BASE_URL } from 'config/app';

export function fetchSource(token, sourceId) {
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query getSource ($id: String) {
          source(id: $id) {
            id
            name
            slug
            description
            image
          }
        }
      `,
      variables: {
        id: sourceId,
      }
    })
  })
    .then(json => {
      console.log('fetchSource', json);
      if (json.data) {
        const source = json.data.source;
        return {
          source: {
            ...source,
            imageFile: [{
              uid: source.image,
              name: source.image,
              status: 'done',
              url: source.image,
            }],
          },
        };
      }
      throw new Error(json.detail);
    });
}

export function addSource(token, source) {
  const newSource = {
    ...source,
  };

  console.log('addSource', newSource);
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation addSource (
          $slug: String,
          $name: String,
          $description: String,
          $image: String,
        ) {
          createSource (
            slug: $slug,
            name: $name,
            description: $description,
            image: $image,
          ) {
            source {
              id
              name
              slug
              description
              image
            }
          }
        }
      `,
      variables: {
        slug: source.slug,
        name: source.name,
        description: source.description,
        image: source.image,
      }
    })
  })
    .then(json => {
      console.log('addSource', json);
      if (json.data && json.data.createSource) {
        const source = json.data.createSource.source;
        return {
          source: {
            ...source,
            imageFile: [{
              uid: source.image,
              name: source.image,
              status: 'done',
              url: source.image,
            }],
          },
        };
      }
      throw new Error(json.detail || json.errors[0].message);
    });
}

export function updateSource(token, source) {
  const newSource = {
    ...source,
  };

  console.log('updateSource', newSource);
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation updateSource (
          $id: String,
          $slug: String,
          $name: String,
          $description: String,
          $image: String,
        ) {
          updateSource (
            id: $id,
            slug: $slug,
            name: $name,
            description: $description,
            image: $image,
          ) {
            source {
              id
              name
              slug
              description
              image
            }
          }
        }
      `,
      variables: {
        id: source.id,
        slug: source.slug,
        name: source.name,
        description: source.description,
        image: source.image,
      }
    })
  })
    .then(json => {
      console.log('updateSource', json);
      if (json.data && json.data.updateSource) {
        const source = json.data.updateSource.source;
        return {
          source: {
            ...source,
            imageFile: [{
              uid: source.image,
              name: source.image,
              status: 'done',
              url: source.image,
            }],
          },
        };
      }
      throw new Error(json.detail || json.errors[0].message);
    });
}
