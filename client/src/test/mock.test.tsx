import { render, screen } from '~test/utils';
import { Text } from '~uikit/text';

describe('Mock test', () => {
  it('should render Text component', () => {
    render(<Text variant="body">Hello world</Text>);
    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
  });
});
