import supabase from "../../utils/supabase"
import Link from "next/link"
import EditConcertForm from "../../components/EditConcertForm"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"

export default function ConcertPage({ concert, concertBands, bands }) {
  return (
    <main className="max-w-2xl p-8">
      <Link href="/">
        <a className="btn btn-link">
          <ArrowLeftIcon className="h-text" />
          Go Back
          </a>
      </Link>
      <h1>Konzert<span className="ml-2 text-sm text-slate-500">{concert.id}</span></h1>
      <EditConcertForm concert={concert} bands={bands} concertBands={concertBands} />
    </main>
  )
}

export async function getServerSideProps({ params }) {

  const { data: concert, error } = await supabase
    .from('concerts')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: concertBands, concertBandsError } = await supabase
    .from('concert_bands')
    .select('*')
    .match({ concert_id: params.id })

  const { data: bands } = await supabase.from('bands').select('*')

  if (error) {
    throw new Error(error.message)
  }
  if (concertBandsError) {
    throw new Error(concertBandsError)
  }

  return {
    props: {
      concert,
      concertBands,
      bands,
    }
  }
}