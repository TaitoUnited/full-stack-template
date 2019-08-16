import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from 'axios';

import config from '../config';
import { Post, PostBasics } from '~shared/types/blog';

interface Store {
  dispatch: (action: any) => any;
}

// NOTE: override axios method return types: `Promise` instead of `AxiosPromise`
// since we are using response interceptors that unwrap `.data` from response
interface CustomAxios extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
}

interface Api {
  store: null | Store;
  http: CustomAxios;
}

const httpClient = axios.create({ baseURL: config.API_URL }) as CustomAxios;

const api: Api = {
  store: null,
  http: httpClient,
};

export const connectApiToStore = (store: Store) => {
  api.store = store;
};

// Interceptors ==============================================================
api.http.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('> API response', response);
    // Unwrap `data` fields since axios wrap response inside `data` field
    return response.data;
  },
  (error: AxiosError) => {
    const { response } = error;

    if (!response) {
      console.log('> Network error', response);
      return Promise.reject(error);
    }

    console.log('> API response error', response);

    if ([401, 403].includes(response.status) && api.store) {
      // TODO: handle logout
      // api.store.dispatch(logout());
    }

    // Axios wraps errors returned by the api inside `response.data`
    return Promise.reject(error);
  }
);

// Exported API methods

export const createPost = async (post: PostBasics): Promise<Post> => {
  const res = await api.http.post('/posts', { data: post });
  return res.data;
};

export const fetchPosts = async () => {
  const res = await api.http.get('/posts');
  return {
    items: res.data,
  };
};
