import axios from 'axios';
import { apiUrl } from '~common/constants';

async function fetch() {
  const resp = await axios.get(`${apiUrl}/posts`);
  return {
    items: resp.data.data,
    total: resp.data.totalCount
  };
}

async function create({ post }) {
  const resp = await axios.post(`${apiUrl}/posts`, post);
  return resp.data.data;
}

export default { fetch, create };
