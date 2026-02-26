import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import axios from "axios";

// These matches the backend token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days

const getCurrentEpochTime = () => Math.floor(new Date().getTime() / 1000);

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const response = await axios.post(
                        `${process.env.NEXTAUTH_BACKEND_URL}auth/login/`,
                        credentials
                    );
                    if (response.data) return response.data;
                } catch (error) {
                    console.error("Auth Error:", error.response?.data || error.message);
                }
                return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "credentials") return true;

            // Handle social login integration with Django
            try {
                const endpoint = account.provider === "google" ? "google/" : "github/";
                const payload = account.provider === "google"
                    ? { access_token: account.id_token }
                    : { access_token: account.access_token };

                const response = await axios.post(
                    `${process.env.NEXTAUTH_BACKEND_URL}auth/${endpoint}`,
                    payload
                );

                // Attach django response to account for jwt callback
                account.djangoAuth = response.data;
                return true;
            } catch (error) {
                console.error(`Social Auth Error (${account.provider}):`, error.response?.data || error.message);
                return false;
            }
        },
        async jwt({ user, token, account }) {
            // Login event
            if (user && account) {
                const djangoData = account.provider === "credentials" ? user : account.djangoAuth;
                token.user = djangoData.user;
                token.accessToken = djangoData.access;
                token.refreshToken = djangoData.refresh;
                token.exp = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
                return token;
            }

            // Refresh token if expired
            if (getCurrentEpochTime() > token.exp) {
                try {
                    const response = await axios.post(
                        `${process.env.NEXTAUTH_BACKEND_URL}auth/token/refresh/`,
                        { refresh: token.refreshToken }
                    );
                    token.accessToken = response.data.access;
                    token.refreshToken = response.data.refresh || token.refreshToken;
                    token.exp = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
                } catch (error) {
                    console.error("Token Refresh Error:", error.response?.data || error.message);
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            session.accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    }
};

export default NextAuth(authOptions);
