export const feedsKeys = {
  all: ['feeds'] as const,
  byId: (id: string) => [...feedsKeys.all, { id }] as const
}
