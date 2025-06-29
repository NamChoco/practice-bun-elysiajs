import { Elysia, t } from 'elysia'
import { createMember, deleteMember, getMember, getMembers, login, updateMember } from './model';
import swagger from '@elysiajs/swagger';
import cookie from '@elysiajs/cookie'
import jwt from '@elysiajs/jwt';

const jwtSecret = Bun.env.JWT_SECRET
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in .env')
}

const app = new Elysia()
  .use(cookie())
  .use(jwt({
    name: 'jwt',
    secret: jwtSecret,
    exp: '7d'
  }))
  .use(swagger())

// Public APIs
app.get('/', () => getMembers())

app.get('/member/:id', ({ params }) => getMember(parseInt(params.id)))

app.post('/member', ({ body, set }) => {
  const response = createMember(body)
  if (response?.status === 'error') {
    set.status = 400
    return { message: 'insert incomplete' }
  }
  return { message: 'OK' }
}, {
  body: t.Object({
    name: t.String(),
    email: t.String(),
    date_of_birth: t.String(),
  })
})

app.put('/member/:id', ({ params, body, set }) => {
  const response = updateMember(parseInt(params.id), body)
  if (response?.status === 'error') {
    set.status = 400
    return { message: 'update incomplete' }
  }
  return { message: 'OK' }
}, {
  body: t.Object({
    name: t.String(),
    email: t.String(),
    date_of_birth: t.String(),
    password: t.String(),
  })
})

app.delete('/member/:id', ({ params, set }) => {
  const response = deleteMember(parseInt(params.id))
  if (response?.status === 'error') {
    set.status = 400
    return { message: 'Cannot delete member' }
  }
  return { message: 'ok' }
})

// User Registration
app.post('/register', async ({ body, set }) => {
  try {
    const userData = { ...body }
    userData.password = await Bun.password.hash(userData.password, {
      algorithm: 'bcrypt',
      cost: 4
    })
    createMember(userData)
    return { message: 'Create user successful!' }
  } catch (error) {
    set.status = 500
    return { message: 'error', error: (error as Error).message }
  }
}, {
  body: t.Object({
    name: t.String(),
    email: t.String(),
    date_of_birth: t.String(),
    password: t.String()
  })
})

// User Login
app.post('/login', async ({ body, set, cookie, jwt }) => {
  try {
    const user = login(body.email) as Record<string, any>

    if (!user) {
      set.status = 401
      return { message: 'Invalid email or password' }
    }

    const match = await Bun.password.verify(body.password, user.password)
    if (!match) {
      set.status = 401
      return { message: 'Invalid email or password' }
    }

    const token = await jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email
    })

    // Set JWT in signed cookie
    cookie.token.set({
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return {
      message: 'Login successful',
      token // Optional: remove from response if only using cookie
    }
  } catch (error) {
    set.status = 500
    return { message: 'error', error: (error as Error).message }
  }
}, {
  body: t.Object({
    email: t.String(),
    password: t.String()
  })
})

app.listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
