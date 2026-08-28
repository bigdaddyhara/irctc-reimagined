import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('YatraSaathi passenger journey', () => {
  it('presents the booking experience as a public mobile website', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /yatrasaathi/i })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /main website navigation/i })).toBeInTheDocument()
    expect(screen.queryByRole('complementary', { name: /primary navigation/i })).not.toBeInTheDocument()
    expect(screen.getByText(/built for simpler journeys/i)).toBeInTheDocument()
  })

  it('starts with a simple task-focused train search', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /where are you going/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /find trains/i })).toBeInTheDocument()
    expect(screen.getByText(/mock data only/i)).toBeInTheDocument()
  })

  it('takes a passenger from search to a confirmed prototype ticket', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /find trains/i }))
    expect(screen.getByRole('heading', { name: /trains for your journey/i })).toBeInTheDocument()
    expect(screen.getByText('Brindavan Express')).toBeInTheDocument()

    const brindavanCard = screen.getByRole('article', { name: /Brindavan Express/i })
    await user.click(within(brindavanCard).getByRole('button', { name: /choose this train/i }))
    expect(screen.getByRole('heading', { name: /who is travelling/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /continue to payment/i }))
    expect(screen.getByRole('heading', { name: /your ticket is ready/i })).toBeInTheDocument()
    expect(screen.getByText('4827 1930')).toBeInTheDocument()
  })

  it('turns a simulated delay into a clear recovery decision', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /open journey mode/i }))
    expect(screen.getByRole('heading', { name: /where your train is/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /simulate a 90 min delay/i }))
    expect(screen.getByRole('heading', { name: /your journey needs attention/i })).toBeInTheDocument()
    expect(screen.getByText(/you may miss the connecting journey/i)).toBeInTheDocument()
  })
})
