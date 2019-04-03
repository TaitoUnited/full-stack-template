import React from 'react';
import { connect } from 'react-redux';
import { I18nProvider as LinguiProvider } from '@lingui/react';
import { Catalogs } from '@lingui/core';

import i18n, { updateI18n, Lang } from '~services/i18n';

interface Props {
  language: Lang;
  children: React.ReactNode;
}

interface State {
  catalogs: Catalogs;
}

// https://lingui.js.org/guides/dynamic-loading-catalogs.html#i18nloadercomponent

class I18nProvider extends React.Component<Props, State> {
  state: Readonly<State> = {
    catalogs: {},
  };

  loadCatalog = async (language: Lang) => {
    // prettier-ignore
    const catalogModule = await import(
      /* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */
      `../../locales/${language}/messages.js`);

    this.setState(
      state => ({
        catalogs: {
          ...state.catalogs,
          [language]: catalogModule.default,
        },
      }),
      () => updateI18n(language, this.state.catalogs)
    );
  };

  componentDidMount() {
    this.loadCatalog(this.props.language);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { language } = nextProps;
    const { catalogs } = nextState;

    if (language !== this.props.language && !catalogs[language]) {
      this.loadCatalog(language);
      return false;
    }

    return true;
  }

  render() {
    const { children, language } = this.props;
    const { catalogs } = this.state;

    // Skip rendering when catalog isn't loaded.
    if (!catalogs[language]) return null;

    return (
      <LinguiProvider i18n={i18n} language={language} catalogs={catalogs}>
        {children}
      </LinguiProvider>
    );
  }
}

export default connect((state: any) => ({
  language: state.settings.language,
}))(I18nProvider);
