import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Define um timer para atualizar o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Se o valor mudar (usuário digitou de novo), cancela o timer anterior
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
