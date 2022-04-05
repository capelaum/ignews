import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { getSession } from 'next-auth/client'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = {
  slug: 'post-slug',
  title: 'post-title',
  content: 'post-content',
  updatedAt: 'post-updatedAt'
}

jest.mock('../../services/prismic')
jest.mock('next-auth/client')

describe('Home page', () => {
  it('should render correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('post-title')).toBeInTheDocument()
    expect(screen.getByText('post-content')).toBeInTheDocument()
    expect(screen.getByText('post-updatedAt')).toBeInTheDocument()
  })

  it('should show only the post preview if user is not subscribed', async () => {
    const getSessionMocked = mocked(getSession)
    const slug = 'post-slug'

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null
    })

    const response = await getServerSideProps({
      req: {
        cookies: {}
      },
      params: {
        slug
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: `/posts/preview/${slug}`,
          permanent: false
        }
      })
    )
  })

  it('should show the hole post if user is subscribed', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)
    const getSessionMocked = mocked(getSession)
    const slug = 'post-slug'

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    })

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        slug: 'post-slug',
        data: {
          title: [
            {
              text: 'post-title',
              type: 'heading'
            }
          ],
          content: [
            {
              text: 'post-content',
              type: 'paragraph'
            }
          ]
        },
        last_publication_date: '04-01-2022'
      })
    } as any)

    const response = await getServerSideProps({
      req: {
        cookies: {}
      },
      params: {
        slug
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'post-slug',
            title: 'post-title',
            content: '<p>post-content</p>',
            updatedAt: 'April 01, 2022'
          }
        }
      })
    )
  })
})
