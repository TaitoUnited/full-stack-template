// import axios from 'axios';
// import { apiUrl } from './common.constants';

export const fetch = ({ criteria, paging }) => {
  // return axios.get(`${apiUrl}/files`, { params: criteria });
  console.log(JSON.stringify(criteria));
  console.log(JSON.stringify(paging));
  const response = {
    headers: {
      'X-Total-Count': 200
    },
    data: [
      {
        id: 99,
        type: 'picture',
        name: `page: ${paging.page}`,
        description: `sortBy: ${paging.sortBy}`
      },
      { id: 1, type: 'picture', name: 'filename1', description: 'filename1' },
      { id: 2, type: 'picture', name: 'filename2', description: 'filename2' },
      { id: 3, type: 'picture', name: 'filename3', description: 'filename3' },
      { id: 4, type: 'picture', name: 'filename4', description: 'filename4' },
      { id: 5, type: 'picture', name: 'filename5', description: 'filename5' },
      { id: 6, type: 'picture', name: 'filename6', description: 'filename6' },
      { id: 7, type: 'picture', name: 'filename7', description: 'filename7' },
      { id: 8, type: 'picture', name: 'filename8', description: 'filename8' },
      { id: 9, type: 'picture', name: 'filename9', description: 'filename9' }
    ]
  };

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(response);
    }, 600);
  });
};

// TODO
export const fetchAutocomplete = ({ name, value }) => {
  const response = {
    data: [
      { name: `${value} ${name} Autocomplete1` },
      { name: `${value} ${name} Autocomplete2` },
      { name: `${value} ${name} Autocomplete3` },
      { name: `${value} ${name} Autocomplete4` }
    ]
  };

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(response);
    }, 100);
  });
};
