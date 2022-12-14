'use client'

import { PageWrapper } from '../layout/PageWrapper'
import React, { useState, useEffect, FC } from 'react'
import supabase from '../../utils/supabase'
import { Button } from '../Button'
import { EditPasswordForm } from './EditPasswordForm'
import { EditProfileForm } from './EditProfileForm'
import { GenreChart } from '../concerts/GenreChart'
import Image from 'next/image'
import { CheckCircleIcon, UserIcon, UserPlusIcon } from '@heroicons/react/20/solid'
import { TopBands } from './TopBands'
import { TopLocations } from './TopLocations'
import { ConcertsChart } from './ConcertsChart'
import { AddFriendModal } from './AddFriendModal'
import { BandSeenFull, Friend, Profile } from '../../types/types'

interface IProfilePage {
  profileData: Profile
  bandsSeen: BandSeenFull[]
  friends: Friend[]
}

export const ProfilePage: FC<IProfilePage> = ({ profileData, bandsSeen, friends }) => {
  const [profile, setProfile] = useState(profileData)
  const [editPassIsOpen, setEditPassIsOpen] = useState(false)
  const [editUsernameIsOpen, setEditUsernameIsOpen] = useState(false)
  const [addFriendIsOpen, setAddFriendIsOpen] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  function unique(array: { id: string | number }[]): any[] {
    const mapOfObjects = new Map(array.map(item => [item.id, item]))
    return [...mapOfObjects.values()]
  }

  const isOwnProfile = user && user.id === profile.id
  const isFriend =
    isOwnProfile === false &&
    friends.find(
      item =>
        item.pending === false && (item.sender.id === user?.id || item.receiver.id === user?.id)
    ) != undefined
  const isPending =
    friends.find(
      item => item.pending && (item.sender.id === user?.id || item.receiver.id === user?.id)
    ) != undefined
  const uniqueBandsSeen = unique(bandsSeen.map(item => item.band))
  const concertsSeen = unique(bandsSeen.map(item => item.concert))
  const festivalsSeen = unique(
    bandsSeen.filter(item => item.concert.is_festival).map(item => item.concert)
  )

  useEffect(() => {
    async function getUser() {
      const {
        data: { user: initUser },
      } = await supabase.auth.getUser()
      setUser(initUser)
    }

    async function downloadAvatar() {
      if (profile.avatar_path) {
        try {
          const { data, error } = await supabase.storage
            .from('avatars')
            .download(profile.avatar_path)

          if (error) {
            throw error
          }
          const url = URL.createObjectURL(data)
          setAvatarUrl(url)
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message)
          } else {
            console.error('Unexpected error', error)
          }
        }
      }
    }

    getUser()
    downloadAvatar()
  }, [profile.username, profile.avatar_path])
  return (
    <PageWrapper>
      <>
        <main className="p-4 md:p-8 w-full max-w-2xl">
          {profile ? (
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-shrink-0 flex justify-center items-center w-16 h-16 rounded-full text-lg text-slate-850 bg-blue-300">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Profile picture"
                      fill={true}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-icon" />
                  )}
                </div>
                <h1 className="mb-0">{profile.username}</h1>
                {isFriend && (
                  <p className="flex gap-2 text-slate-300">
                    <CheckCircleIcon className="h-icon" />
                    Freund
                  </p>
                )}
                {!isFriend && user?.id !== profile.id && (
                  <Button
                    onClick={() => setAddFriendIsOpen(true)}
                    label="Freund hinzuf??gen"
                    contentType="icon"
                    icon={<UserPlusIcon className="h-icon" />}
                    disabled={isPending}
                  />
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-6 rounded-lg bg-slate-800">
                  <p className="mb-0 text-2xl text-venom">{uniqueBandsSeen?.length}</p>
                  <h2 className="text-sm font-normal mb-0">Bands live erlebt</h2>
                </div>
                <div className="p-6 rounded-lg bg-slate-800">
                  <p className="mb-0 text-2xl text-venom">{concertsSeen?.length}</p>
                  <h2 className="text-sm font-normal mb-0">Konzerte besucht</h2>
                </div>
                <div className="p-6 rounded-lg bg-slate-800">
                  <p className="mb-0 text-2xl text-venom">{festivalsSeen?.length}</p>
                  <h2 className="text-sm font-normal mb-0">Festivals besucht</h2>
                </div>
                <TopBands bands={bandsSeen.map(item => item.band)} />
                <div className="col-span-full p-6 rounded-lg bg-slate-800">
                  <GenreChart bands={uniqueBandsSeen} />
                </div>
                <div className="col-span-full p-6 rounded-lg bg-slate-800">
                  <ConcertsChart concerts={concertsSeen} />
                </div>
                <TopLocations locations={concertsSeen.map(item => item.location)} />
              </div>
              {isOwnProfile && (
                <div className="flex gap-3">
                  <Button label="Profil bearbeiten" onClick={() => setEditUsernameIsOpen(true)} />
                  <Button label="Passwort ??ndern" onClick={() => setEditPassIsOpen(true)} />
                </div>
              )}
            </div>
          ) : (
            <div>Bitte melde dich an.</div>
          )}
        </main>
        <EditProfileForm
          isOpen={editUsernameIsOpen}
          setIsOpen={setEditUsernameIsOpen}
          profile={profile}
          setProfile={setProfile}
        />
        <EditPasswordForm isOpen={editPassIsOpen} setIsOpen={setEditPassIsOpen} />
        <AddFriendModal
          isOpen={addFriendIsOpen}
          setIsOpen={setAddFriendIsOpen}
          user={user}
          profile={profile}
        />
      </>
    </PageWrapper>
  )
}
