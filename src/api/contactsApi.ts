import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Contact } from "../types"

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
  tagTypes: ["Contact"],

  endpoints: (builder) => ({
    getContacts: builder.query<Contact[], void>({
      query: () => "/contacts",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Contact" as const, id })),
              { type: "Contact", id: "LIST" },
            ]
          : [{ type: "Contact", id: "LIST" }],
    }),

    addContact: builder.mutation<Contact, Omit<Contact, "id">>({
      query: (newContact) => ({
        url: "/contacts",
        method: "POST",
        body: newContact,
      }),

      invalidatesTags: [{ type: "Contact", id: "LIST" }],
    }),

    deleteContact: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Contact", id },
        { type: "Contact", id: "LIST" },
      ],
    }),

    toggleFavorite: builder.mutation<Contact, Pick<Contact, "id"> & Partial<Contact>>({
      query: ({ id, ...patch }) => ({
        url: `/contacts/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Contact", id: arg.id }],
    }),
  }),
})

export const {
  useGetContactsQuery,
  useAddContactMutation,
  useDeleteContactMutation,
  useToggleFavoriteMutation,
} = contactsApi