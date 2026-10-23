import { useState, useMemo } from "react"
import {
  useGetContactsQuery,
  useDeleteContactMutation,
  useToggleFavoriteMutation,
} from "../api/contactsApi"
import AddContactForm from "./AddContactForm"
import { getErrorMessage } from "../utils/errors"

type FilterStatus = "all" | "favorites"

function ContactsPage() {
  const {
    data: contacts = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetContactsQuery()

  const [toggleFavorite] = useToggleFavoriteMutation()
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation()

  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<FilterStatus>("all")

  const stats = useMemo(() => {
    const total = contacts.length
    const favorites = contacts.filter((c) => c.isFavorite).length
    return { total, favorites }
  }, [contacts])

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch = contact.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim())

      const matchesFilter = filter === "favorites" ? contact.isFavorite : true

      return matchesSearch && matchesFilter
    })
  }, [contacts, searchQuery, filter])

  if (isLoading) return <p>Loading...</p>

  if (isError) {
    return (
      <div>
        <p>{getErrorMessage(error)}</p>
        <button onClick={refetch}>Try again</button>
      </div>
    )
  }

  return (
    <section>
      <h1>Contacts {isFetching && <small>(updating...)</small>}</h1>

      <div>
        <p>Total contacts: <strong>{stats.total}</strong></p>
        <p>Favorite contacts: <strong>{stats.favorites}</strong></p>
      </div>

      <AddContactForm />

      <hr />

      <div>
        <div>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <button
            style={{ fontWeight: filter === "all" ? "bold" : "normal" }}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            style={{ fontWeight: filter === "favorites" ? "bold" : "normal" }}
            onClick={() => setFilter("favorites")}
          >
            Favorites
          </button>
        </div>
      </div>

      <ul>
        {filteredContacts.map((contact) => (
          <li key={contact.id}>
            <div>
              <strong>{contact.name}</strong> {contact.isFavorite ? "★" : ""}
              <div>{contact.phone}</div>
              <div>{contact.email}</div>
            </div>
            <div>
              <button
                onClick={() =>
                  toggleFavorite({
                    id: contact.id,
                    isFavorite: !contact.isFavorite,
                  })
                }
              >
                {contact.isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"}
              </button>
              <button
                onClick={() => deleteContact(contact.id)}
                disabled={isDeleting}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {filteredContacts.length === 0 && <p>No contacts found.</p>}
    </section>
  )
}

export default ContactsPage