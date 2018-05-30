import axios from 'axios';
import { apiUrl } from '~common/constants';

async function fetch() {
  const resp = await axios.get(`${apiUrl}/images`);
  return {
    items: resp.data.data,
    total: resp.data.totalCount
  };
}

// TODO jj
async function fetchItems() {
  const resp = await axios.get(`${apiUrl}/images`);
  return {
    items: resp.data.data,
    totalCount: resp.data.totalCount
  };
}

// TODO jj
async function fetchOptions() {
  return [];
}

async function create({ image }) {
  const resp = await axios.image(`${apiUrl}/images`, image);
  return resp.data.data;
}

async function read({ id }) {
  const resp = await axios.get(`${apiUrl}/images/${id}`);
  return resp.data.data;
}

async function update({ image }) {
  const resp = await axios.put(`${apiUrl}/images/${image.id}`);
  return resp.data.data;
}

async function patch({ image }) {
  const resp = await axios.patch(`${apiUrl}/images/${image.id}`);
  return resp.data.data;
}

async function remove({ id }) {
  const resp = await axios.delete(`${apiUrl}/images/${id}`);
  return resp.data.data;
}

export default {
  fetch,
  fetchItems,
  fetchOptions,
  create,
  read,
  update,
  patch,
  remove
};
