import { render } from '@testing-library/react'
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
    const { getByText } = render(
      <ActiveLink href='/' activeClassName='active' passHref>
        <a>Home</a>
      </ActiveLink>
    )

    expect(getByText('Home')).toBeInTheDocument()
  })

  it('should receive correctly active class', () => {
    const { getByText } = render(
      <ActiveLink href='/' activeClassName='active' passHref>
        <a>Home</a>
      </ActiveLink>
    )

    expect(getByText('Home')).toHaveClass('active')
  })
})
