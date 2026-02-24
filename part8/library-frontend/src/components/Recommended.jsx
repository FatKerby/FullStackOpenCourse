import React, { useState, useEffect } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client/react'
import { ME, ALL_BOOKS_WITH_GENRE } from '../queries'

const Recommended = ({ show }) => {
  const user = useQuery(ME)
  const [getRecommendedBooks, result] = useLazyQuery(ALL_BOOKS_WITH_GENRE)
  const [recommendedBooks, setRecommendedBooks] = useState([])

  useEffect(() => {
    if (result.data) {
      setRecommendedBooks(result.data.allBooks)
    }
  }, [setRecommendedBooks, result])

  useEffect(() => {
    if (user.data) {
      if (user.data.me) {
        getRecommendedBooks({ variables: { genre: user.data.me.favoriteGenre } })
      }
    }
  }, [getRecommendedBooks, user])

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{user.data.me.favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => {
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended