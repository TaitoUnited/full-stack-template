import React from 'react';
import styled from 'styled-components';
import { Heading, Modal, Button } from 'react-components-kit';

import View from '~layout/view.component';

const FilesViewWrapper = styled(View)`
`;

const FilesView = ({ actions, appState }) => (
  <FilesViewWrapper
    className='FilesView'
    title='Files'
    type='fullPage'
  >
    <Modal
      visible={appState.modalVisible}
      hide={actions.onHideModal}
      backdropBg='rgba(0, 0, 0, 0.5)'
    >
      <Modal.Body>
        <Heading>Files Example</Heading>
        <p>
          This example demonstrates mostly backend features like:
        </p>
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
        <Modal.Footer>
          <Button flat onClick={actions.onHideModal}>Ok</Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  </FilesViewWrapper>
);

export default FilesView;
