import axios from 'axios';
import { apiUrl } from '~common/constants';

async function fetch(criteria) {
  const resp = await axios.get(`${apiUrl}/posts`, {
    params: criteria
  });
  return {
    items: resp.data.data,
    totalCount: resp.data.totalCount
  };
}

async function create({ post }) {
  const resp = await axios.post(`${apiUrl}/posts`, post);
  return resp.data.data;
}

async function read({ id }) {
  const resp = await axios.get(`${apiUrl}/posts/${id}`);
  return resp.data.data;
}

async function update({ post }) {
  const resp = await axios.put(`${apiUrl}/posts/${post.id}`);
  return resp.data.data;
}

async function patch({ post }) {
  const resp = await axios.patch(`${apiUrl}/posts/${post.id}`);
  return resp.data.data;
}

async function remove({ id }) {
  const resp = await axios.delete(`${apiUrl}/posts/${id}`);
  return resp.data.data;
}

export default {
  fetch,
  create,
  read,
  update,
  patch,
  remove
};
