import { render, screen } from '@testing-library/react'
import Container from '@/components/shared/container'

describe('Container Component', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div data-testid="test-child">Test Content</div>
      </Container>
    )
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Container className="custom-class">
        <div>Test Content</div>
      </Container>
    )
    
    const container = screen.getByText('Test Content').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('has default container classes', () => {
    render(
      <Container>
        <div>Test Content</div>
      </Container>
    )
    
    const container = screen.getByText('Test Content').parentElement
    expect(container).toHaveClass('container')
    expect(container).toHaveClass('mx-auto')
  })
}) 