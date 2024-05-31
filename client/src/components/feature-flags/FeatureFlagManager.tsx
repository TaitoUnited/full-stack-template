import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button, Checkbox, IconButton, Text, Stack } from '~uikit';
import { styled } from '~styled-system/jsx';
import { stack } from '~styled-system/patterns';
import { useShortcut } from '~hooks/useShortcut';

import {
  Feature,
  features as featureNames,
  enableFeatureInSession,
  isFeatureEnabledInConfig,
  isFeatureEnabledInSession,
  disableFeatureInSession,
} from '~services/feature-flags';

export default function FeatureFlagManager() {
  const [visible, setVisible] = useState(false);

  useShortcut('Meta+K', () => {
    setVisible(prev => !prev);
  });

  return (
    <AnimatePresence>
      {visible && (
        <FeatureFlagManagerWidget onClose={() => setVisible(false)} />
      )}
    </AnimatePresence>
  );
}

const fixedFeatures = featureNames.filter(f => isFeatureEnabledInConfig(f));
const togglableFeatures = featureNames.filter(
  f => !isFeatureEnabledInConfig(f)
);

function FeatureFlagManagerWidget({ onClose }: { onClose: () => void }) {
  const [features, setFeatures] = useState(() =>
    togglableFeatures.map(f => ({
      feature: f,
      enabled: isFeatureEnabledInSession(f),
    }))
  );

  function toggleFeature(feature: Feature) {
    setFeatures(prev =>
      prev.map(f => (f.feature === feature ? { ...f, enabled: !f.enabled } : f))
    );
  }

  function save() {
    features.forEach(f => {
      if (f.enabled) {
        enableFeatureInSession(f.feature);
      } else {
        disableFeatureInSession(f.feature);
      }
    });

    window.location.reload();
  }

  return (
    <Wrapper>
      <Widget
        initial={{ opacity: 0, scale: 0, y: 200, x: 200 }}
        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, scale: 0, y: 200, x: 200 }}
      >
        <Stack direction="column" gap="regular">
          <Text variant="headingM">Feature flags</Text>

          <Text variant="body" lineHeight={1.5}>
            Only features that are not enabled for the current env can be turned
            on for the session.
          </Text>
        </Stack>

        {features.length > 0 && (
          <ul className={stack({ direction: 'column', gap: '$regular' })}>
            {features.map(({ feature, enabled }) => (
              <li key={feature}>
                <Checkbox
                  label={
                    <span>
                      Feature <FeatureName>{feature}</FeatureName>
                    </span>
                  }
                  value={feature}
                  onChange={() => toggleFeature(feature)}
                  isSelected={enabled}
                />
              </li>
            ))}
          </ul>
        )}

        {fixedFeatures.length > 0 && (
          <>
            <Separator>
              <div />
              <Text variant="bodySmall" color="textMuted">
                Enabled in config
              </Text>
              <div />
            </Separator>

            <ul className={stack({ direction: 'column', gap: '$regular' })}>
              {fixedFeatures.map(feature => (
                <li key={feature}>
                  <Checkbox
                    label={
                      <span>
                        Feature <FeatureName>{feature}</FeatureName>
                      </span>
                    }
                    value={feature}
                    isSelected
                    isDisabled
                  />
                </li>
              ))}
            </ul>
          </>
        )}

        {togglableFeatures.length > 0 && (
          <Button variant="filled" color="primary" onPress={save}>
            Save and reload
          </Button>
        )}

        <CloseButton>
          <IconButton icon="close" label="Close" onPress={onClose} />
        </CloseButton>
      </Widget>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    position: 'fixed',
    bottom: '$medium',
    right: '$medium',
  },
});

const Widget = styled(motion.div, {
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '$medium',
    backgroundColor: '$surface',
    borderRadius: '$regular',
    padding: '$medium',
    boxShadow: '$large',
    borderWidth: '1px',
    borderColor: '$line3',
    maxWidth: '400px',
  },
});

const FeatureName = styled('span', {
  base: {
    color: '$text',
    backgroundColor: '$neutral5',
    paddingBlock: '$xxs',
    paddingInline: '$xs',
    borderRadius: '$regular',
    textStyle: '$bodySmallBold',
    fontFamily: 'Menlo, monospace',
  },
});

const Separator = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',

    '& div:first-child, & div:last-child': {
      flex: 1,
      height: '1px',
      backgroundColor: '$line3',
    },
    '& span': {
      paddingInline: '$small',
    },
  },
});

const CloseButton = styled('div', {
  base: {
    position: 'absolute',
    top: '8px',
    right: '8px',
  },
});
