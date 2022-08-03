#!/usr/bin/env node

import inquirer from 'inquirer'
import chalk from 'chalk'
import { prepare, sign_in, cli } from './index.js'

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
await sign_in({ username, password }, prep,
  cli.display_captcha_then_ask_from_command_line({ width: '80%' }))
console.log(chalk.green('✓') + ' Signed in.')
