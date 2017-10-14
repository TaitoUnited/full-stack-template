import React from 'react';
import styled from 'styled-components';
import { Heading, Modal, Button } from 'react-components-kit';

import View from '~layout/view.component';

const UxViewWrapper = styled(View)`
`;

const UxView = ({ actions, appState }) => (
  <UxViewWrapper
    className='UxView'
    title='UX'
    type='fullPage'
  >
    <Modal
      visible={appState.modalVisible}
      hide={actions.onHideModal}
      backdropBg='rgba(0, 0, 0, 0.5)'
    >
      <Modal.Body>
        <Heading>UX Example</Heading>
        <p>
          This example demonstrates:
        </p>
        <ul>
          <li>Styled components</li>
          <li>Layouts</li>
          <li>Animations</li>
        </ul>
        <Modal.Footer>
          <Button flat onClick={actions.onHideModal}>Ok</Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  </UxViewWrapper>
);

export default UxView;
