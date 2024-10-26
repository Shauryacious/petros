import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Define NextAuth configuration
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

// Named exports for HTTP methods (GET and POST)
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
