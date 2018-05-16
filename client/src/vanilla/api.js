import axios from 'axios';

const apiUrl = `${process.env.API_ROOT}${process.env.API_URL}`;

async function fetch() {
  const resp = await axios.get(`${apiUrl}/files`);
  return resp.data;
}

async function create({ file }) {
  const resp = await axios.post(`${apiUrl}/files`, file);
  return resp.data.id;
}

export default { fetch, create };
