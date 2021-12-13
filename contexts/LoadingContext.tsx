import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

interface Props {
  children: any
}

interface Action {
  show: () => void
  hide: () => void
  isShow: boolean
}

const LoadingContext = createContext<Action>({
  show: () => {},
  hide: () => {},
  isShow: false,
})

function LoadingContextProvider({ children }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const show = () => {
    setIsLoading(true)
  }

  const hide = () => {
    setIsLoading(false)
  }

  const value = useMemo<Action>(() => {
    return { show, hide, isShow: isLoading }
  }, [isLoading])

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
}

function useLoadingContext() {
  const context = useContext<Action>(LoadingContext)
  if (context === undefined) {
    throw new Error('useCrudContext must be used within a CrudContextProvider')
  }
  const { show, hide, isShow } = context
  useEffect((): any => {
    return () => {
      hide()
    }
  }, [])

  return { show, hide, isShow }
}

export { LoadingContextProvider, useLoadingContext }
