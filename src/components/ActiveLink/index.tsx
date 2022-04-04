import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { cloneElement, ReactElement } from 'react'

interface ActiveLinkProps extends LinkProps {
  children: ReactElement
  activeClassName: string
}

export function ActiveLink({
  children,
  activeClassName,
  ...rest
}: ActiveLinkProps) {
  const router = useRouter()

  const className = router.asPath === rest.href ? activeClassName : ''

  return <Link {...rest}>{cloneElement(children, { className })}</Link>
}
