import { Text } from '~uikit';
import { render, screen } from '~test/utils';

describe('Mock test', () => {
  it('should render Text component', () => {
    render(<Text variant="body">Hello world</Text>);
    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
  });
});
