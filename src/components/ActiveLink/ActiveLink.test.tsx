import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink component', () => {
  it('should renders correctly', () => {
    render(
      <ActiveLink href='/' activeClassName='active' passHref>
        <a>Home</a>
      </ActiveLink>
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('should receive correctly active class', () => {
    render(
      <ActiveLink href='/' activeClassName='active' passHref>
        <a>Home</a>
      </ActiveLink>
    )

    expect(screen.getByText('Home')).toHaveClass('active')
  })
})
