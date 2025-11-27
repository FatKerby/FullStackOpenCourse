describe('Blog app', function() {
  const testUser = {
    name: "Test User",
    username: "test_user",
    password: "password"
  }

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', testUser) 
    cy.visit('')    
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('Username:')
    cy.contains('Password:')
    cy.contains('Login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type(testUser.username)
      cy.get('#password').type(testUser.password)
      cy.get('#login-button').click()
      cy.contains(`${testUser.name} is logged in.`)    
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type(testUser.username)
      cy.get('#password').type(`wrong${testUser.password}`)
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', `${testUser.name} is logged in.`)
    })
  })

  describe('When logged in', function() {
    const firstBlog = {
      title: 'First Title',
      author: 'First Author',
      url: 'http://firstblog.com',
      likes: 1
    }

    const secondBlog = {
      title: 'Second Title',
      author: 'Second Author',
      url: 'http://secondblog.com',
      likes: 2
    }

    const thirdBlog = {
      title: 'Third Title',
      author: 'Third Author',
      url: 'http://thirdblog.com',
      likes: 3
    }

    beforeEach(function() {
      cy.login(testUser)
    })

    it('A blog can be created', function() {
      const testBlog = {
        title: 'A blog created by cypress',
        author: 'Cypress Blogger',
        url: 'http://cypress-blog-test.fake'
      }
      cy.contains('new blog').click()
      cy.get('#title').type(testBlog.title)
      cy.get('#author').type(testBlog.author)
      cy.get('#url').type(testBlog.url)
      cy.get('#create-button').click()
      cy.contains(`A new blog "${testBlog.title}" by ${testBlog.author} was added.`)
      cy.contains(`"${testBlog.title}" - ${testBlog.author}`)
    })

    it('A blog can be liked', function() {
      cy.createBlog(firstBlog)
      cy.get('#toggle-visibility-button').click()
      cy.get('#likes-button').click()
      cy.contains(`${firstBlog.likes + 1} likes`)
    })

    it('A blog can be deleted by the user who created it', function() {
      cy.createBlog(firstBlog)
      cy.get('#toggle-visibility-button').click()
      cy.get('#remove-button').click()
      cy.contains(`Blog "${firstBlog.title}" by ${firstBlog.author} was deleted.`)
      cy.contains(`"${firstBlog.title}" - ${firstBlog.author}`).should('not.exist')
    })

    it('Only the blog creator can see the remove button', function() {
      cy.createBlog(firstBlog)
      cy.contains(`"${firstBlog.title}" - ${firstBlog.author}`)
      cy.get('#toggle-visibility-button').click()
      cy.get('#remove-button').should('exist')

      const secondUser = {
        name: "Test User 2",
        username: "test_user2",
        password: "password2"
      }
      cy.request('POST', 'http://localhost:3003/api/users/', secondUser)
      cy.login(secondUser)
      cy.contains(`"${firstBlog.title}" - ${firstBlog.author}`)
      cy.get('#toggle-visibility-button').click()
      cy.get('#remove-button').should('not.exist')
    })

    it('Blogs are sorted from most liked to least liked', function() {
      cy.createBlog(firstBlog)
      cy.createBlog(secondBlog)
      cy.createBlog(thirdBlog)

      cy.get('.blog').eq(0).contains('"Third Title" - Third Author')
      cy.get('.blog').eq(1).contains('"Second Title" - Second Author')
      cy.get('.blog').eq(2).contains('"First Title" - First Author')

      cy.get('.blog').eq(1).find('#toggle-visibility-button').click()
      cy.get('#likes-button').click()
      cy.contains('3 likes')
      cy.get('#likes-button').click()
      cy.contains('4 likes')

      cy.get('.blog').eq(0).contains('"Second Title" - Second Author')
      cy.get('.blog').eq(1).contains('"Third Title" - Third Author')
      cy.get('.blog').eq(2).contains('"First Title" - First Author')
    })
  })
})