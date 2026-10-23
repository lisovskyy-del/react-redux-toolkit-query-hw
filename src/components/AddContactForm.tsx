import React, { useState } from "react"
import { useAddContactMutation } from "../api/contactsApi.ts";

function AddContactForm() {
  const [addContact, { isLoading }] = useAddContactMutation()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !phone.trim() || !email.trim()) return

    try {
      await addContact({ name, phone, email, isFavorite }).unwrap()

      setName('')
      setPhone('')
      setEmail('')
      setIsFavorite(false)
    }
    catch (error) {
      console.error("Failed to add contact:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add new contact</h3>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={ (e) => setName(e.target.value) }
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={ (e) => setPhone(e.target.value) }
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={ (e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={isFavorite}
            onChange={ (e) => setIsFavorite(e.target.checked) }
            disabled={isLoading}
          />
          Favourite
        </label>
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add contact" }
      </button>
    </form>
  )
}

export default AddContactForm