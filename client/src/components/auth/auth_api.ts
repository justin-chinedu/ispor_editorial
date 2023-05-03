import { LoginCredentials } from "../../domain/models/auth/login_cred";
import { SignupCredentials } from "../../domain/models/auth/signup_cred";
import { User } from "@supabase/supabase-js";
import authService from "../../domain/services/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import client from "../../domain/services/supabase";
import { UserMeta } from "../../domain/models/user/user_meta";
import { jprint } from "../../core/utils";

export const authApi = createApi(
    {
        reducerPath: "auth",
        baseQuery: fetchBaseQuery({ baseUrl: "/" }),
        tagTypes: ['AuthCheck'],
        endpoints: (builder) => ({
            getUser: builder.query<User | undefined, void>({
                async queryFn() {
                    try {

                        const user = await authService.getUser();
                        return {
                            data: user == null ? undefined : user
                        }
                    } catch (error: any) {
                        if (error.status == 401) {
                            return {
                                data: undefined
                            }
                        }
                        return {
                            error: {
                                status: 500,
                                statusText: "Couldn't fetch user",
                                data: undefined,
                            },
                        }
                    }
                },
                providesTags: ['AuthCheck']
            }),
            updateUserData: builder.mutation<void, UserMeta>(
                {
                    async queryFn(data) {
                        await client.auth.updateUser({
                            data: data,
                        })
                        return {
                            data: undefined
                        }
                    },
                    invalidatesTags: ['AuthCheck']
                }
            ),
            loginUser: builder.mutation<User, LoginCredentials>({
                async queryFn(cred: LoginCredentials) {
                    try {
                        const user = await authService.loginUser(cred)
                        return { data: user }
                    } catch (error) {
                        return {
                            error: {
                                status: 401,
                                statusText: "Couldn't login user",
                                data: error,
                            },
                        }
                    }
                },
                invalidatesTags: ['AuthCheck']
            }),
            signupUser: builder.mutation<User, SignupCredentials>({
                async queryFn(cred: SignupCredentials) {
                    try {
                        const user = await authService.signupUser(cred)
                        return { data: user }
                    } catch (error) {
                        return {
                            error: {
                                status: 401,
                                statusText: "Couldn't signup user",
                                data: undefined,
                            },
                        }
                    }
                },
                invalidatesTags: ['AuthCheck']
            }),
            signoutUser: builder.mutation<undefined, void>({
                queryFn: async () => {
                    try {
                        await authService.signOutUser();
                        return { data: undefined };
                    } catch (error) {
                        return {
                            error: {
                                status: 401,
                                statusText: "Couldn't signout user",
                                data: undefined,
                            },
                        }
                    }
                },
                invalidatesTags: ['AuthCheck']
            })
        }),

    }
)



export const {
    useUpdateUserDataMutation: useUpdateUser,
    useSignoutUserMutation: useSignout,
    useSignupUserMutation: useSignUp,
    useLoginUserMutation: useLogin
} = authApi;

export const { useGetUserQuery: useGetUser } = authApi;
export default authApi;