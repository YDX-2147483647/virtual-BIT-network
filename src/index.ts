import { createWriteStream } from 'fs'
import inquirer from 'inquirer'
import { prepare, sign_in } from './webvpn.js'

const { username, password } = await inquirer.prompt([
  {
    type: 'input',
    name: 'username',
  },
  {
    type: 'password',
    name: 'password',
  },
]) as { username: string, password: string }

const prep = await prepare()

await sign_in({ username, password }, prep, {
  async resolve_captcha (response) {
    const captcha_path = 'captcha.png'

    response.body?.pipe(createWriteStream(captcha_path))
    const answers = await inquirer.prompt([{
      type: 'input',
      name: 'captcha',
      message: `Please check ${captcha_path}. What's the captcha? (case-insensitive)`,
    }]) as { captcha: string }
    return answers.captcha
  },
})
console.log('✓ Signed in.')
