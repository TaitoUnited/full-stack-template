import React from 'react';
import styled from 'styled-components';
import { Heading, Modal, Button } from 'react-components-kit';

import View from '~layout/view.component';

const ReportsViewWrapper = styled(View)`
`;

const ReportsView = ({ actions, appState }) => (
  <ReportsViewWrapper
    className='ReportsView'
    title='Reports'
    type='fullPage'
  >
    <Modal
      visible={appState.modalVisible}
      hide={actions.onHideModal}
      backdropBg='rgba(0, 0, 0, 0.5)'
    >
      <Modal.Body>
        <Heading>Reports Example</Heading>
        <p>
          This example demonstrates:
        </p>
        <ul>
          <li>PDF export using react</li>
          <li>PDF export using html template</li>
          <li>Excel export</li>
        </ul>
        <Modal.Footer>
          <Button flat onClick={actions.onHideModal}>Ok</Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  </ReportsViewWrapper>
);

export default ReportsView;
