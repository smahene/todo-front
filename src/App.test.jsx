import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import App from './App'

describe('App - Todo List', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('devrait afficher le titre Ma TODO List', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    render(<App />)
    expect(screen.getByText('Ma TODO List')).toBeInTheDocument()
  })

  it('devrait afficher les todos après chargement', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, title: 'Apprendre React', completed: false },
        { id: 2, title: 'Faire les tests', completed: true }
      ]
    })
    render(<App />)
    expect(await screen.findByText('Apprendre React')).toBeInTheDocument()
    expect(screen.getByText('Faire les tests')).toBeInTheDocument()
  })

  it('devrait ajouter une tâche', async () => {
    const user = userEvent.setup()
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => {} })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, title: 'Nouvelle tâche', completed: false }] })

    render(<App />)
    await screen.findByPlaceholderText('Nouvelle tâche...')

    await user.type(screen.getByPlaceholderText('Nouvelle tâche...'), 'Nouvelle tâche')
    await user.click(screen.getByRole('button', { name: 'Ajouter' }))

    expect(await screen.findByText('Nouvelle tâche')).toBeInTheDocument()
  })
})