import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest'

describe('auth (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  describe('register', () => {
    it('should be able to register', async () => {
      const response = await request(app.server)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
        })

      expect(response.statusCode).toEqual(201)
    })
  })

  describe('login', () => {
    it('should be able to login', async () => {
      await request(app.server)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
        })

      const response = await request(app.server)
        .post('/auth/login')
        .send({
          email: 'johndoe@email.com',
          password: '123456',
        })

      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual({
        token: expect.any(String),
        user: {
            id: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
            created_at: expect.any(String),
        },
        })
    })
  })

  describe('me', () => {
    it('should be able to get user profile', async () => {
      await request(app.server)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
        })

      const loginResponse = await request(app.server)
        .post('/auth/login')
        .send({
          email: 'johndoe@email.com',
          password: '123456',
        })

      const response = await request(app.server)
        .get('/auth/me')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)

      expect(response.statusCode).toEqual(200)
      expect(response.body.user).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        created_at: expect.any(String),
        
      })
    })
  })
})
