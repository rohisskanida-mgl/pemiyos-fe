import { defineStore } from 'pinia'

export type PollOption = {
  id: string
  label: string
  votes: number
}

export type PollState = {
  question: string
  options: PollOption[]
  selectedOptionId: string | null
}

export const usePollStore = defineStore('poll', {
  state: (): PollState => ({
    question: 'Which feature should we build next?',
    options: [
      { id: 'a', label: 'Dark Mode', votes: 12 },
      { id: 'b', label: 'Offline Support', votes: 8 },
      { id: 'c', label: 'Multi-language', votes: 5 },
    ],
    selectedOptionId: null,
  }),
  getters: {
    totalVotes: (state) => state.options.reduce((sum, o) => sum + o.votes, 0),
  },
  actions: {
    vote(optionId: string) {
      const option = this.options.find((o) => o.id === optionId)
      if (option) {
        option.votes += 1
      }
    },
  },
})


