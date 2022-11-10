import Head from 'next/head'
import supabase from "../utils/supabase"
import ConcertCard from '../components/concerts/ConcertCard'
import Modal from '../components/Modal'
import AddConcertForm from "../components/concerts/AddConcertForm"
import { useState, useEffect } from 'react'
import Button from '../components/Button'
import { ArrowUturnLeftIcon, ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid'
import PageWrapper from '../components/layout/PageWrapper'
import { toast } from 'react-toastify'
import FilterButton from '../components/FilterButton'

export default function Home({ initialConcerts, bands, locations }) {
  const [isOpen, setIsOpen] = useState(false)
  const [concerts, setConcerts] = useState(initialConcerts || [])
  const [selectedBands, setSelectedBands] = useState([])
  const [selectedLocations, setSelectedLocations] = useState([])
  const [bandsSeen, setBandsSeen] = useState([])
  const [sort, setSort] = useState('dateAsc')
  const [user, setUser] = useState(null)
  
  const notifyInsert = () => toast.success("Konzert erfolgreich hinzugefügt!")
  const filteredLength = concerts.filter(filterRule).length !== concerts.length ? concerts.filter(filterRule).length : null

  function filterRule(item) {
    let [bandFilter, locationFilter] = [true, true]
    const selectedBandIds = selectedBands.map(item => item.id)
    const selectedLocationIds = selectedLocations.map(item => item.id)
    if (selectedBandIds.length > 0) {
      bandFilter = item.bands.some(band => selectedBandIds.includes(band.id))
    }
    if (selectedLocationIds.length > 0) {
      locationFilter = selectedLocationIds.includes(item.location?.id)
    }
    return bandFilter && locationFilter
  }

  function compare(a, b) {
    let comparison = 0
    if (a.date_start > b.date_start) {
      if (sort === 'dateAsc') {
        comparison = -1
      } else if (sort === 'dateDsc') {
        comparison = 1
      }
    } else if (a.date_start < b.date_start) {
      if (sort === 'dateAsc') {
        comparison = 1
      } else if (sort === 'dateDsc') {
        comparison = -1
      }
    }
    return comparison
  }

  function resetAll() {
    setSelectedBands([])
    setSelectedLocations([])
  }

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const { data: { user: initUser } } = await supabase.auth.getUser()
    setUser(initUser)
  }

  useEffect(() => {
    async function getBandsSeen() {
      try {
        const { data: initBandsSeen, error: selectedBandsSeenError } = await supabase
          .from('j_bands_seen')
          .select('*')
          .eq('user_id', user.id)

        if (selectedBandsSeenError) {
          throw selectedBandsSeenError
        }

        if (initBandsSeen) {
          setBandsSeen(initBandsSeen)
        }
      } catch (error) {
        alert(error.message)
      }
    }

    if (user) {
      getBandsSeen()
    }
  }, [user])
  return (
    <PageWrapper>
      <Head>
        <title>Concert Diary</title>
        <meta name="description" content="Keep track of your past concerts." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full max-w-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="mb-0">
            Konzerte
          </h1>
          <Button
            onClick={() => setIsOpen(true)}
            label="Konzert hinzufügen"
            style="primary"
            icon={<PlusIcon className="h-icon" />}
          />
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FilterButton
              name="bands"
              options={bands}
              selectedOptions={selectedBands}
              setSelectedOptions={setSelectedBands}
            />
            <FilterButton
              name="locations"
              options={locations}
              selectedOptions={selectedLocations}
              setSelectedOptions={setSelectedLocations}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-300">
              {typeof filteredLength === 'number' && <>{filteredLength}&nbsp;von&nbsp;</>}{concerts.length}&nbsp;Einträge
            </div>
            {typeof filteredLength === 'number' && (
              <button onClick={resetAll} className="flex gap-2 px-2 py-1 rounded-md text-sm hover:bg-slate-800">
                <ArrowUturnLeftIcon className="h-icon text-slate-300" />
                Zurücksetzen
              </button>
            )}
            <div className="flex items-center ml-auto text-sm">
              <label htmlFor="sortBy" className="text-slate-300">
                Sortieren nach:
              </label>
              <div className="relative flex items-center">
                <select onChange={(e) => setSort(e.target.value)} name="sortBy" id="sortBy" className="pl-2 pr-7 py-1 rounded-md hover:bg-slate-800 bg-transparent appearance-none">
                  <option value="dateAsc">Neuste</option>
                  <option value="dateDsc">Älteste</option>
                </select>
                <ChevronDownIcon className="absolute right-2 text-xs h-icon pointer-events-none" />
              </div>
            </div>
          </div>
          {typeof filteredLength === 'number' && filteredLength === 0 ? (
            <div>Blyat! Keine Einträge gefunden.</div>
          ) : (
            concerts.filter(filterRule).sort(compare).map(concert => (
              <ConcertCard
                key={concert.id}
                concert={concert}
                bandsSeen={bandsSeen.filter(row => row.concert_id === concert.id)}
              />
            ))
          )}
        </div>
      </main>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <AddConcertForm
          bands={bands}
          locations={locations}
          setIsOpen={setIsOpen}
          concerts={concerts}
          setConcerts={setConcerts}
        />
      </Modal>
    </PageWrapper>
  )
}

export async function getServerSideProps() {
  const { data: concerts, error: concertsError } = await supabase
    .from('concerts')
    .select('*, location(*), bands!j_concert_bands(*)')
    .order('date_start', { ascending: false, })

  const { data: bands } = await supabase
    .from('bands')
    .select('*')
    .order('name')

  const { data: locations } = await supabase.from('locations').select('id,name')

  if (concertsError) {
    console.error(concertsError);
  }

  return {
    props: {
      initialConcerts: concerts,
      bands,
      locations,
    }
  }

}
