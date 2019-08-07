import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Trans } from '@lingui/macro';
import { connect } from 'react-redux';

import { settings } from './settings.model';
import LangButton from './LangButton';
import { Page } from '~ui';
import { Lang } from '~common/services/i18n';

interface Props {
  language: Lang;
  changeLanguage: (language: Lang) => any;
}

const Settings = ({ language, changeLanguage }: Props) => (
  <Page>
    <Typography variant="h6">
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

export default connect(
  (state: any) => ({
    language: state.settings.language,
  }),
  {
    changeLanguage: settings.actions.changeLanguage,
  }
)(Settings) as any;
