'use client'

import * as React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface LoginFormProps extends React.ComponentPropsWithoutRef<'div'> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  // Create a Supabase client configured to use cookies
  const [supabase] = React.useState(() => createClientComponentClient())

  const [formState, setFormState] = React.useState<{
    email: string
  }>({
    email: ''
  })

  const signIn = async () => {
    const { email } = formState

    // const [, tld] = email.split('@')
    // if (tld !== process.env.NEXT_PUBLIC_ALLOWED_DOMAINS) {
    //   return new Error('You are not allowed here')
    // }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        shouldCreateUser: false
      }
    })
    return error
  }

  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()
    setIsLoading(true)

    const error = await signIn()

    if (error) {
      setIsLoading(false)
      toast.error(error.message)
      return
    }

    setIsLoading(false)
    toast.success('Check your email for a magic link')
    router.refresh()
  }

  return (
    <div {...props}>
      <form onSubmit={handleOnSubmit}>
        <fieldset className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={formState.email}
              onChange={e =>
                setFormState(prev => ({
                  ...prev,
                  email: e.target.value
                }))
              }
            />
          </div>
        </fieldset>

        <div className="mt-4 flex items-center">
          <Button disabled={isLoading}>
            {isLoading && <IconSpinner className="mr-2 animate-spin" />}
            Sign In
          </Button>
        </div>
      </form>
    </div>
  )
}
