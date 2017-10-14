import React from 'react';
import styled from 'styled-components';
import { Heading, Modal, Button } from 'react-components-kit';

import View from '~layout/view.component';

const UsersViewWrapper = styled(View)`
`;

const UsersView = ({ actions, appState }) => (
  <UsersViewWrapper
    className='UsersView'
    title='Users'
    type='fullPage'
  >
    <Modal
      visible={appState.modalVisible}
      hide={actions.onHideModal}
      backdropBg='rgba(0, 0, 0, 0.5)'
    >
      <Modal.Body>
        <Heading>Users Example</Heading>
        <p>
          This example demonstrates:
        </p>
        <ul>
          <li>Auth0 for login, terms agreement and user management</li>
          <li>Firebase for login, terms agreement and user management</li>
          <li>WordPress user management integration</li>
          <li>Custom user management implementation: passwordless magic links
              and simple user management implemented on admin-on-rest</li>
        </ul>
        <Modal.Footer>
          <Button flat onClick={actions.onHideModal}>Ok</Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  </UsersViewWrapper>
);

export default UsersView;
