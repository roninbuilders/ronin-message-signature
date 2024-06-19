import { ronin, saigon } from 'viem/chains'
import { createRoninModal } from '@roninbuilders/modal-wagmi'

export const config = createRoninModal({
  projectId: "b28d4116d7aad56368379ac594360b72",
  chain: ronin,
  metadata: {
    name: 'My Website',
    description: 'My website description',
    url: 'https://mywebsite.com',
    icons: ['https://mywebsite.com/icon']
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
