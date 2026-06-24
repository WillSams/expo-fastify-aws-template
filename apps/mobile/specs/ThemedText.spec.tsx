import { render, screen } from '@testing-library/react-native';
import { ThemedText } from '@/components/themed-text';

describe('ThemedText', () => {
  it('renders its children', async () => {
    await render(<ThemedText>Hello world</ThemedText>);

    expect(screen.getByText('Hello world')).toBeTruthy();
  });

  it('applies the bold title style for the title type', async () => {
    await render(<ThemedText type="title">Big heading</ThemedText>);

    const node = screen.getByText('Big heading');
    const flattened = Object.assign({}, ...[].concat(node.props.style));
    expect(flattened.fontWeight).toBe('bold');
    expect(flattened.fontSize).toBe(32);
  });
});
