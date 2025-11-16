import { useState, useEffect, useCallback } from 'react'

type BudgetItem = {
  _id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  date: string
  recurring: boolean
}

type BudgetSummary = {
  income: number
  expenses: number
  balance: number
  categoryBreakdown: Record<string, { income: number; expense: number }>
}

export function useBudget(month?: number, year?: number) {
  const [items, setItems] = useState<BudgetItem[]>([])
  const [summary, setSummary] = useState<BudgetSummary>({ 
    income: 0, 
    expenses: 0, 
    balance: 0, 
    categoryBreakdown: {} 
  })
  const [loading, setLoading] = useState(true)

  const fetchBudget = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      const params = month && year ? `?month=${month}&year=${year}` : ''
      
      const [itemsRes, summaryRes] = await Promise.all([
        fetch(`/api/budget${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/budget/summary${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])
      
      if (itemsRes.ok && summaryRes.ok) {
        const itemsData = await itemsRes.json()
        const summaryData = await summaryRes.json()
        setItems(itemsData)
        setSummary(summaryData)
      }
    } catch (err) {
      console.error('Failed to fetch budget:', err)
    } finally {
      setLoading(false)
    }
  }, [month, year])

  const createItem = async (itemData: Omit<BudgetItem, '_id' | 'userId'>) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      })
      if (res.ok) {
        await fetchBudget() // Refresh to update summary
      }
    } catch (err) {
      console.error('Failed to create budget item:', err)
    }
  }

  const updateItem = async (id: string, updates: Partial<BudgetItem>) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/budget/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })
      if (res.ok) {
        await fetchBudget()
      }
    } catch (err) {
      console.error('Failed to update budget item:', err)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/budget/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      await fetchBudget()
    } catch (err) {
      console.error('Failed to delete budget item:', err)
    }
  }

  useEffect(() => {
    void fetchBudget()
  }, [fetchBudget])

  return {
    items,
    summary,
    loading,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchBudget
  }
}
