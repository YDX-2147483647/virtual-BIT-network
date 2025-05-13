import { encryptPassword } from './webvpn.ts'

test('AES algorithm', () => {
  expect(encryptPassword('Pulaski’s chicken soup', 'yfrJ+rK7z6K3scjZsv3Kog==')).toBe(
    '6IJjgVgLB9zDi9JyDTJaQPgS4aYBaFn921QDdYPTbwY=',
  )
})
