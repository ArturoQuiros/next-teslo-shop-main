import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { checkUserEmailPassword, oAuthToDbUser } from "../../../database/dbUsers";

export default NextAuth({
  providers: [

    CredentialsProvider({
        name: "Custom Login",
        credentials: {
          email: { label: "Correo:", type: "email", placeholder: "correo@google.com" },
          password: {  label: "Contraseña:", type: "password", placeholder: "Contraseña" }
        },
        async authorize(credentials, req) {

          return await checkUserEmailPassword(credentials!.email, credentials!.password);

        }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),

  ],

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    maxAge: 2592000, //30d
    strategy: 'jwt',
    updateAge: 86400, //1d
  },

  callbacks: {
    
    async jwt({ token, user, account }) {

        if(account){
            token.accessToken = account.access_token;
            switch (account.type) {
                case 'oauth':
                    token.user = await oAuthToDbUser(user?.email || '', user?.name || '');
                    break;
                case 'credentials':
                    token.user = user;
                    break;
            }
        }

        return token;
    },
    
    async session({ session, user, token }) {

        session.accessToken = token.accessToken;
        session.user = token.user as any;

        return session;
    },

  }
})