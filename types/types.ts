import { User } from '@supabase/supabase-js'
import { Database } from './supabase'

type WithLocation = {
  location: Location | null
}

type WithCountry = {
  country: Country | null
}

type WithBands = {
  bands: Band[] | null
}

type WithGenres = {
  genres: Genre[] | null
}

export type Concert = Database['public']['Tables']['concerts']['Row'] & WithLocation & WithBands

export type Comment = Database['public']['Tables']['comments']['Row']

export type Band = Database['public']['Tables']['bands']['Row'] & WithCountry & WithGenres

export type BandSeenFull = BandSeen & {
  band: Band
  concert: Concert
  user: User
}

export type BandSeen = Database['public']['Tables']['j_bands_seen']['Row']

export type Genre = Database['public']['Tables']['genres']['Row']

export type Location = Database['public']['Tables']['locations']['Row']

export type Country = Database['public']['Tables']['countries']['Row']

export type Profile = Database['public']['Tables']['profiles']['Row']

export type Friend = Database['public']['Tables']['friends']['Row'] & {
  sender: Profile
  receiver: Profile
}

export type Option = Band | Genre
