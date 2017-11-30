import qs from 'qs';
import {
  fetchUtils,
  GET_ONE,
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  UPDATE,
  CREATE,
  DELETE
} from 'admin-on-rest';

import { addTokenToOptions } from './api.util';

const contentRangeErrorMsg = `The X-Total-Count header is missing in the HTTP
Response. The REST client expects responses for lists of resources to contain
this header with the total number of results to build the pagination. If you
are using CORS, did you declare X-Total-Count in the
Access-Control-Expose-Headers header?`;

const createRestClient = (apiUrl, httpClient = fetchUtils.fetchJson) => {
  const convertRESTRequestToHTTP = (type, resource, params) => {
    let url = '';
    const options = {};

    switch (type) {
    case GET_LIST: {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify(params.filter)
      };
      url = `${apiUrl}/${resource}?${qs.stringify(query)}`;
      break;
    }
    case GET_ONE:
      url = `${apiUrl}/${resource}/${params.id}`;
      break;
    case GET_MANY: {
      const query = {
        filter: JSON.stringify({ id: params.ids })
      };
      url = `${apiUrl}/${resource}?${qs.stringify(query)}`;
      break;
    }
    case GET_MANY_REFERENCE: {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify({
          ...params.filter,
          [params.target]: params.id
        })
      };
      url = `${apiUrl}/${resource}?${qs.stringify(query)}`;
      break;
    }
    case UPDATE:
      url = `${apiUrl}/${resource}/${params.id}`;
      options.method = 'PATCH';
      options.body = JSON.stringify(params.data);
      break;
    case CREATE:
      url = `${apiUrl}/${resource}`;
      options.method = 'POST';
      options.body = JSON.stringify(params.data);
      break;
    case DELETE:
      url = `${apiUrl}/${resource}/${params.id}`;
      options.method = 'DELETE';
      break;
    default:
      throw new Error(`Unsupported fetch action type ${type}`);
    }

    addTokenToOptions(options);

    return { url, options };
  };

  /**
   * @param {Object} response HTTP response from fetch()
   * @param {String} type One of the constants appearing at the top if this file
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The REST request params, depending on the type
   * @returns {Object} REST response
   */
  const convertHTTPResponseToREST = (response, type, resource, params) => {
    const { headers, json = {} } = response;

    /* NOTE:
     * admin-on-rest wants a data obj returned
     * even when the response has no content
     */
    if (response.status === 204) return { data: {} };

    switch (type) {
    case GET_LIST:
    case GET_MANY_REFERENCE:
      if (!headers.has('X-Total-Count')) {
        throw new Error(contentRangeErrorMsg);
      }
      return {
        data: json.data,
        total: parseInt(headers.get('X-Total-Count'), 10) || 100
      };
    case CREATE:
      return { data: { ...params.data, id: json.data.id } };
    default:
      return { data: json.data };
    }
  };

  /**
   * @param {string} type Request type, e.g GET_LIST
   * @param {string} resource Resource name, e.g. "posts"
   * @param {Object} payload Request parameters. Depends on the request type
   * @returns {Promise} the Promise for a REST response
   */
  return (type, resource, params) => {
    const { url, options } = convertRESTRequestToHTTP(type, resource, params);
    return httpClient(url, options).then(response =>
      convertHTTPResponseToREST(response, type, resource, params)
    );
  };
};

export default createRestClient;
