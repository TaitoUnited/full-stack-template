import qs from 'qs';

import {
  fetchUtils,
  GET_ONE,
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  UPDATE,
  CREATE,
  DELETE,
} from 'react-admin';

import { addTokenToOptions } from './api.util';

// const contentRangeErrorMsg = `The X-Total-Count header is missing in the HTTP
// Response. The REST client expects responses for lists of resources to contain
// this header with the total number of results to build the pagination. If you
// are using CORS, did you declare X-Total-Count in the
// Access-Control-Expose-Headers header?`;

const createRestClient = (
  apiUrl: string,
  httpClient = fetchUtils.fetchJson
) => {
  const convertRESTRequestToHTTP = (
    type: string,
    resource: any,
    params: any
  ) => {
    let url = '';
    const options: any = {};

    switch (type) {
      case GET_LIST: {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
          sort: JSON.stringify([field, order]),
          range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
          filter: JSON.stringify(params.filter),
        };
        url = `${apiUrl}/${resource}?${qs.stringify(query)}`;
        break;
      }
      case GET_ONE:
        url = `${apiUrl}/${resource}/${params.id}`;
        break;
      case GET_MANY: {
        const query = {
          filter: JSON.stringify({ id: params.ids }),
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
            [params.target]: params.id,
          }),
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

  const convertHTTPResponseToREST = (
    response: any,
    type: string,
    resource: any,
    params: any
  ) => {
    const { json = {} } = response;

    /* NOTE:
     * react-admin wants a data obj returned
     * even when the response has no content
     */
    if (response.status === 204) return { data: {} };

    switch (type) {
      case GET_LIST:
      case GET_MANY_REFERENCE:
        // if (!headers.has('X-Total-Count')) {
        //   throw new Error(contentRangeErrorMsg);
        // }
        return {
          data: json.data,
          total: json.totalCount,
          // parseInt(headers.get('X-Total-Count'), 10) || 100
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
  return (type: string, resource: any, params: any) => {
    const { url, options } = convertRESTRequestToHTTP(type, resource, params);

    return httpClient(url, options).then((response: any) =>
      convertHTTPResponseToREST(response, type, resource, params)
    );
  };
};

export default createRestClient;
