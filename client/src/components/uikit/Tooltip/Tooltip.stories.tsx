import { Stack, FillButton, Tooltip } from '~uikit';

export default {
  title: 'Tooltip',
  component: Tooltip,
};

export function Example() {
  return (
    <Stack direction="row" gap="$medium" style={{ padding: 32 }}>
      <div>
        <Tooltip title="I'm a tooltip" position="top">
          <FillButton variant="primary">Top</FillButton>
        </Tooltip>
      </div>

      <div>
        <Tooltip title="I'm a tooltip" position="bottom">
          <FillButton variant="primary">Bottom</FillButton>
        </Tooltip>
      </div>

      <div>
        <Tooltip title="I'm a tooltip" position="left">
          <FillButton variant="primary">Left</FillButton>
        </Tooltip>
      </div>

      <div>
        <Tooltip title="I'm a tooltip" position="right">
          <FillButton variant="primary">Right</FillButton>
        </Tooltip>
      </div>
    </Stack>
  );
}
