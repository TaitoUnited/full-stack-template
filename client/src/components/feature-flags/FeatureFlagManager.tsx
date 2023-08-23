import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Checkbox, FillButton, IconButton, Text } from '~uikit';
import { Stack, styled } from '~styled-system/jsx';
import { stack } from '~styled-system/patterns';
import { useShortcut } from '~utils/observe';

import {
  Feature,
  features as featureNames,
  enableFeatureInSession,
  isFeatureEnabledInConfig,
  isFeatureEnabledInSession,
  disableFeatureInSession,
} from '~utils/feature-flags';

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
        <Stack direction="column" gap="$normal">
          <Text variant="title3">Feature flags</Text>

          <Text variant="body" lineHeight={1.5}>
            Only features that are not enabled for the current env can be turned
            on for the session.
          </Text>
        </Stack>

        {features.length > 0 && (
          <ul className={stack({ direction: 'column', gap: '$normal' })}>
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

            <ul className={stack({ direction: 'column', gap: '$normal' })}>
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
          <FillButton variant="info" onClick={save}>
            Save and reload
          </FillButton>
        )}

        <CloseButton>
          <IconButton icon="x" label="Close" onClick={onClose} />
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
    backgroundColor: '$elevated',
    borderRadius: '$normal',
    padding: '$medium',
    boxShadow: '$large',
    border: '1px solid',
    borderColor: '$border',
    maxWidth: '400px',
  },
});

const FeatureName = styled('span', {
  base: {
    color: '$text',
    backgroundColor: '$muted5',
    paddingBlock: '$xxsmall',
    paddingInline: '$xsmall',
    borderRadius: '$normal',
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
      backgroundColor: '$border',
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
