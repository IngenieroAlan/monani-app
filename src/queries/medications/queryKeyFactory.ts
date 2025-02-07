export const medicationsKeys = {
  all: ['medications'] as const,
  byId: (id: string) => [...medicationsKeys.all, { id }] as const
}
