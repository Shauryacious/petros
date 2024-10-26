// app/page.js or any component that uses `useSession`
'use client'; // This makes it a Client Component

import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>NextAuth Google Sign-In</h1>
      {!session ? (
        <>
          <p>Not signed in</p>
          <button onClick={() => signIn('google')}>Continue with Google</button>
        </>
      ) : (
        <>
          <p>Signed in as {session.user.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
}
