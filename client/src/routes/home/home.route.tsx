import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';

import { useDocumentTitle } from '~/hooks/use-document-title';
import { isFeatureEnabled } from '~/services/feature-flags';
import { styled } from '~/styled-system/jsx';
import { Card } from '~/uikit/card';
import { Icon, type IconName } from '~/uikit/icon';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';

export const Route = createFileRoute('/_app/$workspaceId/')({
  component: HomeRoute,
});

export default function HomeRoute() {
  const { t } = useLingui();
  useDocumentTitle(t`Home`);

  const featureEnabled = isFeatureEnabled('feature-1');

  if (featureEnabled) {
    console.log('Feature 1 is enabled!');
  }

  const features: Array<{
    icon: IconName;
    title: string;
    description: string;
  }> = [
    {
      icon: 'eye',
      title: t`Accessibility`,
      description: t`Good accessibility is a something that should be expected from every app. The building blocks for creating accessible components are provided by React Aria. This template has pre-built UI kit components, such as Button, Text, TextInput, etc., that have accessibility baked into them. You can use and extend this UI kit to fit your needs.`,
    },
    {
      icon: 'bank',
      title: t`Authentication`,
      description: t`Practically every app needs to have a way to log in the user. This template provides a barebones authentication setup that should be extended to have a real way to log in the user either with a cookie or JWT based authentication method.`,
    },
    // {
    //   icon: 'moon',
    //   title: t`Dark Mode`,
    //   description: t`Having dark mode support is a common ask from users nowadays. This template has a ready-to-use theming setup with light and dark themes that can be easily modified to conform to the client's branding. Try to toggle the theme in the top right corner.`,
    // },
    {
      icon: 'star',
      title: t`Design System`,
      description: t`A minimal design system provides a set of UI kit components that adhere to certain design principles backed by a set of design tokens. This template defines a comprehensive set of design tokens for things like colors, typography, spacing, etc. in a globally available theme object. Additionally, the design system incorporates a UI kit that is browsable in Storybook.`,
    },
    {
      icon: 'language',
      title: t`Internationalization`,
      description: t`Most apps will require internationalization at some point in their lifetime. This template the necessary setup for multiple languages that are loaded lazily once selected. Try changing the language in the top right corner.`,
    },
    {
      icon: 'download',
      title: t`Route Preloading`,
      description: t`Speed is one of the most important aspects of a good UX. This template introduces a pattern for preloading route's data and code-split code in order to make page transitions feel instant.`,
    },
    {
      icon: 'viewAgenda',
      title: t`Skeleton Placeholders`,
      description: t`Spinners, so many spinners, everywhere. Traditional Single-Page-Applications usually show spinners while loading data for a given page. Instead of showing simple spinners this template offers a way to implement skeleton placeholders for pages with a cool shimmering effect.`,
    },
    {
      icon: 'leaf',
      title: t`Splash Screen`,
      description: t`No one likes looking at a blank screen. This template implements a traditional Single-Page-Application which means that the initial JS bundle has to downloaded before the app can render. A nice looking splash screen can be shown until the app is ready to render making the app loading UX more pleasant.`,
    },
  ];

  if (featureEnabled) {
    features.push({
      icon: 'save',
      title: t`Feature Flags`,
      description: t`Feature flags enable true continuous deployment by making it possible to ship incomplete features to production without negatively affecting normal app usage.`,
    });
  }

  return (
    <Stack direction="column" gap="xl">
      <Stack direction="column" gap="regular">
        <Text variant="headingXl">
          <Trans>Home</Trans>
        </Text>

        <Text variant="headingM" color="textMuted" lineHeight={1.5}>
          <Trans>Welcome to Taito Fullstack Template!</Trans>
        </Text>

        <Text variant="body" color="textMuted" lineHeight={1.5}>
          <Trans>
            This React app contains the necessary building blocks that you need
            to get your project started. You can freely alter any aspect of the
            template to fit your needs better.
          </Trans>
        </Text>
      </Stack>

      <Stack direction="column" gap="medium">
        <Text variant="headingL">
          <Trans>Examples</Trans>
        </Text>

        <Text variant="body" color="textMuted" lineHeight={1.5}>
          <Trans>
            In the sidebar you can browse through some example pages. (TODO: add
            more examples)
          </Trans>
        </Text>
      </Stack>

      <Stack direction="column" gap="medium">
        <Text variant="headingL">
          <Trans>Features</Trans>
        </Text>

        <Cards>
          {features.map(feature => (
            <Card key={feature.title}>
              <Stack direction="column" gap="regular">
                <Stack direction="row" gap="xs" align="center">
                  <Icon name={feature.icon} size={24} color="text" />
                  <Text variant="headingM">{feature.title}</Text>
                </Stack>

                <Text variant="body" color="textMuted" lineHeight={1.6}>
                  {feature.description}
                </Text>
              </Stack>
            </Card>
          ))}
        </Cards>
      </Stack>
    </Stack>
  );
}

const Cards = styled('div', {
  base: {
    display: 'grid',
    gridGap: '$regular',
    gridTemplateColumns: '50% 50%',
  },
});
