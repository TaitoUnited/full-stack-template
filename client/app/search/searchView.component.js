import React from 'react';

import {
  Heading,
} from 'react-components-kit';

const SearchView = () => (
  <div className='SearchView'>
    <Heading>Search</Heading>
    Search example demonstrates:
    <ul>
      <li>React + redux + saga</li>
      <li>Splitting feature into subfeatures that
          share common functionality</li>
      <li>Using postgres for text search</li>
      <li>Paging</li>
      <li>Caching</li>
      <li>Robot tests</li>
      <li>Unit tests</li>
    </ul>
    TODO: implement using react + redux + saga
    TODO: use saga to implement simple autocomplete for basic search?
    NOTE: no need to implement the advanced search (advanced directory
          exists just to demonstrate the subfeature structure).
  </div>
);

export default SearchView;
