import axios from 'axios';
import { apiUrl } from '~common/constants';

async function fetch(criteria) {
  const resp = await axios.get(`${apiUrl}/files`, {
    params: criteria
  });
  return {
    items: resp.data.data,
    totalCount: resp.data.totalCount
  };
}

async function create({ file }) {
  const resp = await axios.file(`${apiUrl}/files`, file);
  return resp.data.data;
}

async function read({ id }) {
  const resp = await axios.get(`${apiUrl}/files/${id}`);
  return resp.data.data;
}

async function update({ file }) {
  const resp = await axios.put(`${apiUrl}/files/${file.id}`);
  return resp.data.data;
}

async function patch({ file }) {
  const resp = await axios.patch(`${apiUrl}/files/${file.id}`);
  return resp.data.data;
}

async function remove({ id }) {
  const resp = await axios.delete(`${apiUrl}/files/${id}`);
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
