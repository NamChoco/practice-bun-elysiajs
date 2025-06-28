import { Elysia, t } from 'elysia'
import { createMember, deleteMember, getMember, getMembers, login, updateMember } from './model';
import swagger from '@elysiajs/swagger';
import cookie from '@elysiajs/cookie'
import jwt from '@elysiajs/jwt';
const jwtSecret = Bun.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in .env")
}

const app = new Elysia()
  .use(cookie())
  .use(
    jwt({
      name: 'jwt',
      secret: jwtSecret!,
      exp: '7d'
    })
  )

app.use(swagger())

// Get member all
app.get('/', () => getMembers())
// Get member by ID
app.get('/member/:id', ({ params }) => getMember(parseInt(params.id)))
// Create member
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
// Update member
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
// Delete member
app.delete('/member/:id', ({ params, set }) => {
  const response = deleteMember(parseInt(params.id))
  if (response?.status === 'error') {
    set.status = 400
    return { message: 'Cannot delete member' }
  }
  return { message: 'ok' }
})

// User API
app.post('/register', async ({ body, set }) => {
  try {
    let userData: any = body
    userData.password = await Bun.password.hash(userData.password, {
      algorithm: "bcrypt",
      cost: 4, // number between 4-31
    });
    createMember(userData)
    return { message: 'Create user successful!' }
  } catch (error) {
    set.status = 500
    return { message: 'error', error }
  }
}, {
  body: t.Object({
    name: t.String(),
    email: t.String(),
    date_of_birth: t.String(),
    password: t.String(),
  })
})

app.post('/login', async (ctx: any) => {
  const { body, set } = ctx
  const setCookie = ctx.setCookie
  const jwt = ctx.jwt

  const user = login(body.email) as Record<string, any>
  console.log('🔍 Found user:', user)

  if (!user) {
    set.status = 401
    return { message: 'Invalid email or password' }
  }

  const match = await Bun.password.verify(body.password, user.password)
  console.log('🔐 Password match:', match)

  if (!match) {
    set.status = 401
    return { message: 'Invalid email or password' }
  }

  const token = await jwt.sign({
    id: user.id,
    name: user.name,
    email: user.email
  })

  setCookie('token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'strict'
  })

  return {
    message: 'Login successful',
    token
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
