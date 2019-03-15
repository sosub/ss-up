/*
 *
 * SpeakersPage apis
 *
 */

import request from 'utils/request';
import { BASE_URL } from 'config/app';

export function fetchSpeaker(token, speakerId) {
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query getSpeaker ($id: String) {
          speaker(id: $id) {
            id
            name
            slug
            description
            image
          }
        }
      `,
      variables: {
        id: speakerId,
      }
    })
  })
    .then(json => {
      console.log('fetchSpeaker', json);
      if (json.data) {
        const speaker = json.data.speaker;
        return {
          speaker: {
            ...speaker,
            imageFile: [{
              uid: speaker.image,
              name: speaker.image,
              status: 'done',
              url: speaker.image,
            }],
          },
        };
      }
      throw new Error(json.detail);
    });
}

export function addSpeaker(token, speaker) {
  const newSpeaker = {
    ...speaker,
  };

  console.log('addSpeaker', newSpeaker);
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation addSpeaker (
          $slug: String,
          $name: String,
          $description: String,
          $image: String,
        ) {
          createSpeaker (
            slug: $slug,
            name: $name,
            description: $description,
            image: $image,
          ) {
            speaker {
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
        slug: speaker.slug,
        name: speaker.name,
        description: speaker.description,
        image: speaker.image,
      }
    })
  })
    .then(json => {
      console.log('addSpeaker', json);
      if (json.data && json.data.createSpeaker) {
        const speaker = json.data.createSpeaker.speaker;
        return {
          speaker: {
            ...speaker,
            imageFile: [{
              uid: speaker.image,
              name: speaker.image,
              status: 'done',
              url: speaker.image,
            }],
          },
        };
      }
      throw new Error(json.detail || json.errors[0].message);
    });
}

export function updateSpeaker(token, speaker) {
  const newSpeaker = {
    ...speaker,
  };

  console.log('updateSpeaker', newSpeaker);
  return request(`${BASE_URL}/graphql_token`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation updateSpeaker (
          $id: String,
          $slug: String,
          $name: String,
          $description: String,
          $image: String,
        ) {
          updateSpeaker (
            id: $id,
            slug: $slug,
            name: $name,
            description: $description,
            image: $image,
          ) {
            speaker {
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
        id: speaker.id,
        slug: speaker.slug,
        name: speaker.name,
        description: speaker.description,
        image: speaker.image,
      }
    })
  })
    .then(json => {
      console.log('updateSpeaker', json);
      if (json.data && json.data.updateSpeaker) {
        const speaker = json.data.updateSpeaker.speaker;
        return {
          speaker: {
            ...speaker,
            imageFile: [{
              uid: speaker.image,
              name: speaker.image,
              status: 'done',
              url: speaker.image,
            }],
          },
        };
      }
      throw new Error(json.detail || json.errors[0].message);
    });
}
