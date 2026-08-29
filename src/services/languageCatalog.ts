import type { Language, TimePreference } from '../domain/types'

export const speechLocales: Record<Language, string> = { english: 'en-IN', hindi: 'hi-IN', bengali: 'bn-IN', telugu: 'te-IN', marathi: 'mr-IN', tamil: 'ta-IN', gujarati: 'gu-IN', kannada: 'kn-IN', malayalam: 'ml-IN', odia: 'or-IN', punjabi: 'pa-IN', assamese: 'as-IN' }
export const timeWords: Record<TimePreference, string[]> = { 'early-morning': ['early morning', 'पहाटे'], morning: ['morning', 'savera', 'subah', 'सवेरे', 'सुबह'], afternoon: ['afternoon', 'दोपहर'], evening: ['evening', 'shaam', 'शाम', 'संध्याकाळी'], night: ['night', 'tonight', 'raat', 'रात', 'रात्री'] }
export const tomorrowWords = ['tomorrow', 'कल', 'আগামীকাল', 'రేపు', 'उद्या', 'நாளை', 'કાલે', 'ನಾಳೆ', 'നാളെ', 'ଆସନ୍ତାକାଲି', 'ਕੱਲ੍ਹ', 'কালি']
