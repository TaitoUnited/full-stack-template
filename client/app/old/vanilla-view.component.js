import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Button,
  Heading,
  Input,
  Layout,
} from 'react-components-kit';

const InputGroup = styled(Layout)`
  & > div {
    margin: 10px 10px 10px 0;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1px !important;
  position: relative;
  width: ${props => props.width || 'auto'};
`;

const VanillaView = ({ actions, files }) => {
  // TODO unique key for newly added files
  const fileElements = files.map(file => (
    <div key={file.id}>
      {`${file.name} ${file.description}`}
    </div>
  ));

  // TODO each section as a separate function
  return (
    <div>
      <Heading>OLD EXAMPLE</Heading>

      <Heading el='h2'>Relational Database</Heading>
      <InputGroup>
        <InputWrapper width='300px'>
          <Input onChange={() => {}} />
        </InputWrapper>
        <Button onClick={actions.onSearchFiles}>
          Search
        </Button>
      </InputGroup>
      <InputGroup>
        <Button
          onClick={() => {
            actions.onAddFile({ name: 'toyota.jpg', description: 'Blah' });
          }}
        >
          Add file
        </Button>
      </InputGroup>
      {fileElements}

      <br /><br />
      <Heading el='h2'>Logging and alerts</Heading>
      Press a button to cause an error on...
      <InputGroup>
        <Button onClick={actions.onCauseErrorOnBrowser}>
          Browser
        </Button>
        <Button onClick={actions.onCauseErrorOnServer}>
          Server
        </Button>
      </InputGroup>
      Press a button to cause `not found` on...
      <InputGroup>
        <Button onClick={actions.onCauseErrorOnNginx}>
          nginx
        </Button>
      </InputGroup>

      <a
        href='https://sentry.io/taitounited/server-template/'
        target='_blank'
        rel='noopener noreferrer'
      >
        See errors on Sentry
      </a>
      <a
        href='https://console.cloud.google.com/logs'
        target='_blank'
        rel='noopener noreferrer'
      >
        See logs on Stackdriver
      </a> (Select &quot;GKE Container&quot; and REPONAME-server)

      NOTE: Sentry and Stackdriver reporting are disabled
      in local development.

    </div>
  );
};

VanillaView.propTypes = {
  actions: PropTypes.any,
  files: PropTypes.array,
};

export default VanillaView;
