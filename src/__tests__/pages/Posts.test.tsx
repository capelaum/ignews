import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import Posts, { getStaticProps, Post } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

const posts = [
  {
    slug: 'post-slug',
    title: 'post-title',
    abstract: 'post-abstract',
    updatedAt: 'post-updatedAt'
  }
] as Post[]

jest.mock('../../services/prismic')

describe('Posts page', () => {
  it('should render correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('post-title')).toBeInTheDocument()
    expect(screen.getByText('post-abstract')).toBeInTheDocument()
    expect(screen.getByText('post-updatedAt')).toBeInTheDocument()
  })

  it('should load initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'post-slug',
            data: {
              title: [
                {
                  text: 'post-title',
                  type: 'heading'
                }
              ],
              content: [
                {
                  text: 'post-abstract',
                  type: 'paragraph'
                }
              ]
            },
            last_publication_date: '04-01-2022'
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'post-slug',
              title: 'post-title',
              abstract: 'post-abstract',
              updatedAt: 'April 01, 2022'
            }
          ]
        }
      })
    )
  })
})
