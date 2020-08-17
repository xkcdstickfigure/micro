import Page from '../components/Page'
import ConfusedCat from '../components/ConfusedCat'
import Link from 'next/link'

export default function NotFound () {
  return (
    <Page>
      <h1 className='text-5xl font-medium'>404</h1>
      <p>We're having trouble finding that page! Maybe go to the <Link href='/'><a className='text-primary'>homepage</a></Link>.</p>

      <ConfusedCat />
      <p className='text-right text-sm'>Confused Alles Cat by{' '}
        <Link href='/u/[id]' as='/u/93e0b06c-e129-415a-aa0a-476473f4d0d2'>
          <a className='text-primary'>Will Jones</a>
        </Link>
      </p>
    </Page>
  )
}
