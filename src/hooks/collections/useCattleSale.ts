import Cattle from '@/database/models/Cattle'
import CattleSale from '@/database/models/CattleSale'
import { useEffect, useState } from 'react'

const useCattleSale = (cattle: Cattle) => {
  const [cattleSale, setCattleSale] = useState<CattleSale>()

  useEffect(() => {
    const subscription = cattle.sale.observe().subscribe((data) => {
      setCattleSale(data[0])
    })

    return () => subscription.unsubscribe()
  }, [cattle.sale])

  return { cattleSale }
}

export default useCattleSale
