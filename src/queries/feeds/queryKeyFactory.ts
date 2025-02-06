export const feedsKey = {
  all: ['feeds'] as const,
  byId: (id: string) => [...feedsKey.all, { id }] as const
}
