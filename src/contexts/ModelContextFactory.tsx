import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'

type ModelContextType<T> = {
  value?: T
  setValue: Dispatch<SetStateAction<T | undefined>>
}

export const createModelContext = <T,>() => {
  const ModelContext = createContext<ModelContextType<T> | undefined>(undefined)

  const ModelProvider = ({ children }: { children: ReactNode }) => {
    const [value, setValue] = useState<T>()

    return (
      <ModelContext.Provider value={{ value, setValue }}>
        {children}
      </ModelContext.Provider>
    )
  }

  const useModelContext = () => {
    const model = useContext(ModelContext)

    if (!model) {
      throw new Error('useModelContext must be used within the corresponding ModelProvider.')
    }

    return model
  }

  return { ModelProvider, useModelContext }
}
