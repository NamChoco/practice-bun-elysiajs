import { Elysia, t } from 'elysia'
import { createMember, deleteMember, getMember, getMembers, updateMember } from './model';
import swagger from '@elysiajs/swagger';

const app = new Elysia()

app.use(swagger())

// Get member all
app.get('/', () => getMembers())
// Get member by ID
app.get('/member/:id', ({ params }) => getMember(parseInt(params.id)))
// Create member
app.post('/member', ({body, set}) => {
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
app.put('/member/:id', ({params, body, set}) => {
  const response = updateMember( parseInt(params.id), body)
  if (response?.status === 'error'){
    set.status = 400
    return { message: 'update incomplete' }
  }
  return { message: 'OK' }
})
// Delete member
app.delete('/member/:id', ({params, set}) => {
  const response = deleteMember(parseInt(params.id))
  if( response?.status === 'error'){
    set.status = 400
    return { message: 'Cannot delete member' }
  }
  return { message: 'ok' }
})

app.listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
