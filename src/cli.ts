#!/usr/bin/env node

import { input, password as input_password } from '@inquirer/prompts'
import chalk from 'chalk'
import { load } from 'cheerio'
import VirtualBIT from './index.ts'

const username = await input({ message: 'Username:' })
const password = await input_password({ message: 'Password:' })

const proxy = new VirtualBIT({ username, password })
await proxy.sign_in()
console.log(`${chalk.green('✓')} Signed in.`)

const url = await input({ message: 'Test which website? (eg. dzb.bit.edu.cn)' })

const response = await proxy.fetch(url)
const html = await response.text()
const $ = load(html)
console.log(`Got “${$('title').prop('innerText')}”.`)
