/**
 * 登录网站
 */

import { Buffer } from 'node:buffer'
import crypto from 'node:crypto'
import { load as load_html } from 'cheerio'
import { to_form_data } from './util.ts'

/** sso.bit.edu.cn WebVPN URL with trailing slash */
const auth_server = 'https://webvpn.bit.edu.cn/https/77726476706e69737468656265737421e3e44ed225397c1e7b0c9ce29b5b/cas/'

/** 导出仅用于测试，不建议使用 */
export function encryptPassword(password: string, salt: string): string {
  const salt_bytes = Buffer.from(salt, 'base64')
  // The third arg of `createCipheriv`, `iv`, could be `null`, but it does not work in deno.
  const cipher = crypto.createCipheriv('aes-128-ecb', salt_bytes, Buffer.alloc(0))
  const encrypted = cipher.update(password, 'utf8')
  return Buffer.concat([encrypted, cipher.final()]).toString('base64')
}

export interface Preparation {
  salt: string
  execution: string
  cookie: string
}

export async function prepare(): Promise<Preparation> {
  const response = await fetch(`${auth_server}login`)
  const html = await response.text()

  const $ = load_html(html)
  return {
    salt: $('#login-croypto').text() as string,
    execution: $('#login-page-flowkey').text() as string,
    cookie: response.headers.get('Set-Cookie') as string,
  }
}

/**
 * 登录
 * @param param0
 * @param param1 {@link prepare}
 */
export async function sign_in(
  { username, password }: { username: string; password: string },
  { execution, cookie, salt }: Preparation,
): Promise<void> {
  // 1. Post the sign in form

  const response = await fetch(`${auth_server}login`, {
    method: 'POST',
    headers: { cookie },
    body: to_form_data({
      username,
      password: encryptPassword(password, salt),
      _eventId: 'submit',
      type: 'UsernamePassword',
      execution,
      croypto: salt,
    }),
  })

  // 2. Check why failed

  if (response.status !== 200) {
    const html = await response.text()
    const $ = load_html(html)
    const reason = $('#login-error-msg')?.prop('innerText') || 'Unknown reason'
    throw new Error(`Sign in failed with ${response.status} ${response.statusText}: ${reason}.`)
  }
}
