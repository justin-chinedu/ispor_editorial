import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RequestType } from "../../core/request_state";
import { ForumSection } from "../../domain/models/forum_section";
import forumSectionDao from "../../domain/dao/forum_sections_dao";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const forumSectionApi = createApi(
    {
        reducerPath: 'forum_sections',
        baseQuery: fetchBaseQuery({ baseUrl: '/' }),
        refetchOnReconnect: true,
        endpoints: (builder) => ({
            fetchAllSections: builder.query(
                {
                    async queryFn() {
                        try {
                            const sections = await forumSectionDao.fetchAllSections();
                            return { data: sections };
                        } catch (error) {
                            return {
                                error: {
                                    status: 500,
                                    data: null,
                                }
                            }
                        }
                    },
                }
            )
        }),
    }
)

export const { useFetchAllSectionsQuery } = forumSectionApi;
export default forumSectionApi;
