export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bands: {
        Row: {
          name: string
          id: number
          country: number | null
        }
        Insert: {
          name: string
          id?: number
          country?: number | null
        }
        Update: {
          name?: string
          id?: number
          country?: number | null
        }
      }
      comments: {
        Row: {
          id: number
          created_at: string | null
          concert_id: string | null
          content: Json | null
          user_id: string | null
          edited_at: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          concert_id?: string | null
          content?: Json | null
          user_id?: string | null
          edited_at?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          concert_id?: string | null
          content?: Json | null
          user_id?: string | null
          edited_at?: string | null
        }
      }
      concerts: {
        Row: {
          created_at: string | null
          is_public: boolean | null
          date_start: string | null
          date_end: string | null
          id: string
          is_festival: boolean | null
          name: string | null
          location: number | null
        }
        Insert: {
          created_at?: string | null
          is_public?: boolean | null
          date_start?: string | null
          date_end?: string | null
          id?: string
          is_festival?: boolean | null
          name?: string | null
          location?: number | null
        }
        Update: {
          created_at?: string | null
          is_public?: boolean | null
          date_start?: string | null
          date_end?: string | null
          id?: string
          is_festival?: boolean | null
          name?: string | null
          location?: number | null
        }
      }
      countries: {
        Row: {
          id: number
          name: string | null
          iso2: string
          iso3: string | null
          local_name: string | null
          continent: Database["public"]["Enums"]["continents"] | null
        }
        Insert: {
          id?: number
          name?: string | null
          iso2: string
          iso3?: string | null
          local_name?: string | null
          continent?: Database["public"]["Enums"]["continents"] | null
        }
        Update: {
          id?: number
          name?: string | null
          iso2?: string
          iso3?: string | null
          local_name?: string | null
          continent?: Database["public"]["Enums"]["continents"] | null
        }
      }
      friends: {
        Row: {
          sender_id: string
          receiver_id: string
          created_at: string | null
          pending: boolean
          accepted_at: string | null
        }
        Insert: {
          sender_id: string
          receiver_id: string
          created_at?: string | null
          pending?: boolean
          accepted_at?: string | null
        }
        Update: {
          sender_id?: string
          receiver_id?: string
          created_at?: string | null
          pending?: boolean
          accepted_at?: string | null
        }
      }
      genres: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      j_band_genres: {
        Row: {
          band_id: number
          genre_id: number
        }
        Insert: {
          band_id: number
          genre_id: number
        }
        Update: {
          band_id?: number
          genre_id?: number
        }
      }
      j_bands_seen: {
        Row: {
          concert_id: string
          user_id: string
          band_id: number
        }
        Insert: {
          concert_id: string
          user_id: string
          band_id: number
        }
        Update: {
          concert_id?: string
          user_id?: string
          band_id?: number
        }
      }
      j_concert_bands: {
        Row: {
          concert_id: string
          band_id: number
        }
        Insert: {
          concert_id: string
          band_id: number
        }
        Update: {
          concert_id?: string
          band_id?: number
        }
      }
      locations: {
        Row: {
          id: number
          name: string
          city: string | null
        }
        Insert: {
          id?: number
          name: string
          city?: string | null
        }
        Update: {
          id?: number
          name?: string
          city?: string | null
        }
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          username: string
          avatar_path: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          username: string
          avatar_path?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          username?: string
          avatar_path?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
    }
  }
}
