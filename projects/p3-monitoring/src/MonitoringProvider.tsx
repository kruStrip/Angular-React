import { useEffect, useState, type ReactNode } from 'react'
import { loadJson } from './data'
import { MonitoringContext, type Monitoring } from './monitoring'
import type { Run, Site } from './types'

type MonitoringProviderProps = {
  children: ReactNode
}

function MonitoringProvider({ children }: MonitoringProviderProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [history, setHistory] = useState<Run[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [list, results] = await Promise.all([
          loadJson<Site[]>('sites.json'),
          loadJson<{ history: Run[] }>('results.json'),
        ])
        if (!ignore) {
          setSites(list)
          setHistory(results.history)
        }
      } catch (e) {
        if (!ignore) {
          setError((e as Error).message)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [attempt])

  function retry() {
    setAttempt((value) => value + 1)
  }

  const monitoring: Monitoring = { sites, history, loading, error, retry }

  return <MonitoringContext value={monitoring}>{children}</MonitoringContext>
}

export default MonitoringProvider
