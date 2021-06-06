import Stack from '../Stack';
import FillButton from '../Buttons/FillButton';
import Tooltip from './index';

export default {
  title: 'Tooltip',
  component: Tooltip,
};

export function Example() {
  return (
    <Stack axis="x" spacing="medium" style={{ padding: 32 }}>
      <div>
        <Tooltip title="I'm a tooltip" position="top">
          <FillButton variant="primary">Tooltip on top</FillButton>
        </Tooltip>
      </div>

      <div>
        <Tooltip title="I'm a tooltip" position="bottom">
          <FillButton variant="primary">Tooltip at bottom</FillButton>
        </Tooltip>
      </div>

      <div>
        <Tooltip title="I'm a tooltip" position="left">
          <FillButton variant="primary">Tooltip on left side</FillButton>
        </Tooltip>
      </div>

      <div>
        <Tooltip title="I'm a tooltip" position="right">
          <FillButton variant="primary">Tooltip on right side</FillButton>
        </Tooltip>
      </div>
    </Stack>
  );
}
