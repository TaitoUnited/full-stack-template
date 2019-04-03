import React from 'react';
import { Typography } from '@material-ui/core';
import { Trans } from '@lingui/macro';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { Page, withErrorBoundary } from '~ui';
import { Lang } from '~common/services/i18n';
import styled from '~common/styled';
import { settings } from './settings.model';

interface Props {
  language: Lang;
  changeLanguage: (language: Lang) => any;
}

const Settings = ({ language, changeLanguage }: Props) => (
  <Page>
    <Typography variant="title">
      <Trans>Settings</Trans>
    </Typography>
    <Typography>
      <Trans>Change language</Trans>
    </Typography>
    <br />
    <LangButton onClick={() => changeLanguage('fi')} active={language === 'fi'}>
      fi
    </LangButton>
    <LangButton onClick={() => changeLanguage('en')} active={language === 'en'}>
      en
    </LangButton>
  </Page>
);

const LangButton = styled('button')<{ active: boolean }>`
  color: ${props => (props.active ? '#3f51b5' : '#222')};
  border: 2px solid ${props => (props.active ? '#3f51b5' : '#ddd')};
  border-radius: 12px;
  height: 54px;
  width: 54px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  background-color: transparent;
  margin-right: 16px;
`;

const enhance = compose(
  withErrorBoundary,
  connect(
    (state: any) => ({
      language: state.settings.language,
    }),
    {
      changeLanguage: settings.actions.changeLanguage,
    }
  )
);

export default enhance(Settings) as any;
