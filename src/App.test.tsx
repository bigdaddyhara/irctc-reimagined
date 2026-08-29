import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('Indian Railways passenger journey', () => {
  it('presents the booking experience as a public mobile website', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /indian railways home/i })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /main website navigation/i })).toBeInTheDocument()
    expect(screen.queryByRole('complementary', { name: /primary navigation/i })).not.toBeInTheDocument()
    expect(screen.getByText(/built for simpler journeys/i)).toBeInTheDocument()
  })

  it('uses native language names and changes visible copy when a language is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /profile/i }))
    expect(screen.getByRole('button', { name: 'தமிழ்' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'தமிழ்' }))
    expect(screen.getByRole('heading', { name: 'சுயவிவரம் மற்றும் விருப்பங்கள்' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'முகப்பு' })).toBeInTheDocument()
  })

  it('lets first-time passengers edit the route, date, and class before searching', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.clear(screen.getByRole('textbox', { name: 'Starting station' }))
    await user.type(screen.getByRole('textbox', { name: 'Starting station' }), 'Mumbai Central')
    await user.clear(screen.getByRole('textbox', { name: 'Destination station' }))
    await user.type(screen.getByRole('textbox', { name: 'Destination station' }), 'Pune')
    const travelDate = screen.getByDisplayValue('2026-08-28')
    fireEvent.change(travelDate, { target: { value: '2026-09-14' } })
    await user.selectOptions(screen.getByRole('combobox', { name: 'Travel class' }), 'AC 3 Tier')
    await user.click(screen.getByRole('button', { name: /find trains/i }))

    expect(screen.getByText(/Mumbai Central to Pune/i)).toBeInTheDocument()
    expect(screen.getByText(/14 Sept? 2026/i)).toBeInTheDocument()
    expect(screen.getAllByText('AC 3 Tier').length).toBeGreaterThan(0)
  })

  it('shows station suggestions and carries the chosen route through the journey', async () => {
    const user = userEvent.setup()
    render(<App />)

    const fromField = screen.getByRole('textbox', { name: 'Starting station' })
    await user.clear(fromField)
    await user.type(fromField, 'Mumbai')
    await user.click(screen.getByRole('option', { name: 'Mumbai Central' }))

    const toField = screen.getByRole('textbox', { name: 'Destination station' })
    await user.clear(toField)
    await user.type(toField, 'Pune')
    await user.click(screen.getByRole('option', { name: 'Pune' }))
    await user.click(screen.getByRole('button', { name: /find trains/i }))

    expect(screen.getByText(/Mumbai Central to Pune/i)).toBeInTheDocument()
    await user.click(within(screen.getByRole('article', { name: /Deccan Queen/i })).getByRole('button', { name: /choose this train/i }))
    await user.click(screen.getByRole('button', { name: /continue to payment/i }))
    expect(screen.getByText('Mumbai Central')).toBeInTheDocument()
    expect(screen.getByText('Pune')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /open journey mode/i }))
    expect(screen.getByRole('heading', { name: /on the way to Pune/i })).toBeInTheDocument()
    expect(screen.getByText(/Mumbai Central/)).toBeInTheDocument()
  })

  it('changes synthetic journey details when the route changes', async () => {
    const user = userEvent.setup()
    render(<App />)
    const fromField = screen.getByRole('textbox', { name: 'Starting station' })
    await user.clear(fromField)
    await user.type(fromField, 'Jaipur')
    await user.click(screen.getByRole('option', { name: 'Jaipur' }))
    await user.click(screen.getByRole('button', { name: /find trains/i }))
    expect(screen.getByText(/Jaipur to Bengaluru/)).toBeInTheDocument()
    expect(screen.getByText('Jaipur–Bengaluru Express')).toBeInTheDocument()
    expect(screen.queryByText('Brindavan Express')).not.toBeInTheDocument()
  })

  it('generates four route-specific journeys for an uncovered route', async () => {
    const user = userEvent.setup()
    render(<App />)
    const fromField = screen.getByRole('textbox', { name: 'Starting station' })
    await user.clear(fromField)
    await user.type(fromField, 'Kochi Ernakulam')
    await user.click(screen.getByRole('option', { name: 'Kochi Ernakulam' }))
    const toField = screen.getByRole('textbox', { name: 'Destination station' })
    await user.clear(toField)
    await user.type(toField, 'Mumbai Central')
    await user.click(screen.getByRole('option', { name: 'Mumbai Central' }))
    await user.click(screen.getByRole('button', { name: /find trains/i }))
    expect(screen.queryByText('Brindavan Express')).not.toBeInTheDocument()
    expect(screen.getByText(/4 journeys/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Kochi Ernakulam–Mumbai Central via/)).toHaveLength(4)
  })

  it('uses browser speech recognition to fill a spoken route', async () => {
    const user = userEvent.setup()
    class FakeSpeechRecognition {
      static instance: FakeSpeechRecognition
      onstart?: () => void
      onend?: () => void
      onerror?: () => void
      onresult?: (event: unknown) => void

      constructor() {
        FakeSpeechRecognition.instance = this
      }

      start() {
        this.onstart?.()
      }
    }

    vi.stubGlobal('SpeechRecognition', FakeSpeechRecognition)
    render(<App />)
    await user.click(screen.getByRole('button', { name: /try speaking/i }))

    expect(screen.getByRole('button', { name: /listening/i })).toBeInTheDocument()
    FakeSpeechRecognition.instance.onresult?.({ results: [[{ transcript: 'Mumbai to Pune' }]] })

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Starting station' })).toHaveValue('Mumbai Central')
      expect(screen.getByRole('textbox', { name: 'Destination station' })).toHaveValue('Pune')
    })
    expect(screen.getByRole('status')).toHaveTextContent(/check the fields/i)
    vi.unstubAllGlobals()
  })

  it('starts with a simple task-focused train search', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /where are you going/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /find trains/i })).toBeInTheDocument()
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
