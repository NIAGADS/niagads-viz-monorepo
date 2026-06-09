import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions = {
    secret: process.env.AUTH_SECRET,
    providers: [
        CognitoProvider({
            clientId: process.env.COGNITO_CLIENT_ID,
            clientSecret: process.env.COGNITO_CLIENT_SECRET,
            issuer: process.env.COGNITO_ISSUER,
            profile(profile) {
                // AW TODO: OV needs to update user pool cognito for this to work
                return {
                    id: profile.sub,
                    email: profile.email ?? null,
                    name: `${profile.given_name} ${profile.family_name}`,
                    first_name: profile.given_name ?? null,
                    last_name: profile.family_name ?? null,
                };
            },
        }),
    ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
