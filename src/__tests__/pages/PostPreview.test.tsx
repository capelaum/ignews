import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = {
  slug: 'post-slug',
  title: 'post-title',
  content: 'post-content',
  updatedAt: 'post-updatedAt'
}

jest.mock('../../services/prismic')
jest.mock('next-auth/client')
jest.mock('next/router')

describe('PostPreview page', () => {
  it('should render correctly', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])

    render(<PostPreview post={post} />)

    expect(screen.getByText('post-title')).toBeInTheDocument()
    expect(screen.getByText('post-content')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('should redirect to the full post if user is subscribed', () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: 'fake-active-subscription'
      },
      false
    ])

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<PostPreview post={post} />)

    expect(pushMock).toHaveBeenCalledWith(`/posts/${post.slug}`)
  })

  it('should show the post preview if user is not subscribed', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

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

    const response = await getStaticProps({
      req: {
        cookies: {}
      },
      params: {
        slug: post.slug
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
