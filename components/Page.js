import { Circle } from 'react-feather'
import { Header, Breadcrumb, Avatar } from '@reactants/ui'
import { useUser } from '../utils/userContext'
import Head from 'next/head'

export default function Page (props) {
  const user = useUser()

  return (
    <>
      <Head>
        <title>{props.title ? `Micro • ${props.title}` : 'Alles Micro'}</title>
      </Head>

      <Header>
        <div className='p-5 max-w-2xl w-full mx-auto flex justify-between'>
          <Breadcrumb>
            <Breadcrumb.Item
              href='#'
              className='font-medium text-lg inline-flex items-center'
            >
              <Circle className='text-gray-500 inline w-5 mr-2' />
              Micro
            </Breadcrumb.Item>
          </Breadcrumb>

          <div className='flex items-center'>
            <Avatar id={user.id} size={37.5} />
          </div>
        </div>
      </Header>

      <div className='sm:max-w-xl p-5 mx-auto my-5 space-y-7'>{props.children}</div>
    </>
  )
}
