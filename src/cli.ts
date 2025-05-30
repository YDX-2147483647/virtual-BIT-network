#!/usr/bin/env node

import chalk from 'chalk'
import { load } from 'cheerio'
import inquirer from 'inquirer'
import VirtualBIT from './index.ts'

const { username, password } = (await inquirer.prompt([
  {
    type: 'input',
    name: 'username',
  },
  {
    type: 'password',
    name: 'password',
  },
])) as { username: string; password: string }

const proxy = new VirtualBIT({ username, password })
await proxy.sign_in()
console.log(`${chalk.green('✓')} Signed in.`)

const { url } = (await inquirer.prompt([
  {
    type: 'input',
    name: 'url',
    message: 'Test which website? (eg. dzb.bit.edu.cn)',
  },
])) as { url: string }

const response = await proxy.fetch(url)
const html = await response.text()
const $ = load(html)
console.log(`Got “${$('title').prop('innerText')}”.`)
