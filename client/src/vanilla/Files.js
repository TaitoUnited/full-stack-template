import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, Heading, Layout } from 'react-components-kit';

const propTypes = {
  files: PropTypes.array.isRequired,
  onAddFile: PropTypes.func.isRequired
};

const Files = ({ files, onAddFile }) => {
  const fileElements = files.map(file => (
    <div key={file.id}>{`${file.name} ${file.description}`}</div>
  ));

  return (
    <div>
      <Heading>Files</Heading>
      <InputGroup>
        <Button
          onClick={() => {
            onAddFile({ name: 'toyota.jpg', description: 'Blah' });
          }}
        >
          Add file
        </Button>
      </InputGroup>
      {fileElements}
    </div>
  );
};

const InputGroup = styled(Layout)`
  & > div {
    margin: 10px 10px 10px 0;
  }
`;

Files.propTypes = propTypes;

export default Files;
