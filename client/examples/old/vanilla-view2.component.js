import React from 'react';
import styled from 'styled-components';

import {
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

const VanillaView2 = () => (
  <div>
    <Heading>OLD EXAMPLE</Heading>

    <Heading el='h2'>Relational Database</Heading>
    <InputGroup>
      <InputWrapper width='300px'>
        <Input onChange={() => {}} />
      </InputWrapper>
    </InputGroup>

    <Heading el='h2'>Logging and alerts</Heading>
    Press a button to cause an error on...
    Press a button to cause `not found` on...

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
    </a> (Select "GKE Container" and REPONAME-server)

    NOTE: Sentry and Stackdriver reporting are disabled
    in local development.

  </div>
);

export default VanillaView2;
