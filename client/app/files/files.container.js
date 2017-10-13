import React from 'react';

import {
  Heading,
} from 'react-components-kit';

const FilesContainer = () => (
  <div>
    <Heading>Files</Heading>
    Files example demonstrates mostly backend features like:
    <ul>
      <li>Upload / download</li>
      <li>File handling (bucket)</li>
      <li>Using postgres as a mongo-like document database</li>
      <li>Transactions</li>
      <li>Shuttle integration</li>
      <li>Cron jobs</li>
      <li>Autoscaling job queue and a progress animation</li>
      <li>Messaging (email/sms)</li>
    </ul>
    TODO: implement using vanilla react
  </div>
);

export default FilesContainer;
