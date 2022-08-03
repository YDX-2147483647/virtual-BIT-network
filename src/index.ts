import fetch, { Headers, Request, RequestInfo, RequestInit, Response } from 'node-fetch'
import {
  ask_from_command_line,
  display_captcha_then_ask_from_command_line,
  save_captcha_then_ask_from_command_line,
} from './captcha_handlers.js'
import { decrypt_URL, encrypt_URL } from './convert.js'
import { CaptchaHandler, prepare, sign_in } from './webvpn.js'

export { decrypt_URL, encrypt_URL }
export { CaptchaHandler }
export const cli = {
  ask_from_command_line,
  save_captcha_then_ask_from_command_line,
  display_captcha_then_ask_from_command_line,
}

export class VirtualBIT {
  username: string
  password: string
  cookie: string | null

  constructor ({ username, password }: { username: string, password: string }) {
    this.username = username
    this.password = password
    this.cookie = null
  }

  async sign_in (resolve_captcha: CaptchaHandler) {
    const prep = await prepare()
    await sign_in({ username: this.username, password: this.password }, prep, resolve_captcha)
    this.cookie = prep.cookie
  }

  /**
   * 原始`fetch`的包装
   * @param url
   * @param init 可能会被修改
   * @returns
   * 传入的 cookie 会丢失。
   */
  fetch (url: RequestInfo, init?: RequestInit | undefined): Promise<Response> {
    if (this.cookie === null) {
      throw new Error('Should sign in first.')
    }

    // 1. Encrypt the URL
    if (typeof url === 'string') {
      url = encrypt_URL(url)
    } else {
      // `Request` objects' properties are read only.
      url = new Request(encrypt_URL(url.url), url)
    }

    // 2. Add cookie
    // todo
    if (typeof url !== 'string') {
      url.headers.set('cookie', this.cookie)
    }
    if (init?.headers instanceof Headers) {
      init.headers.set('cookie', this.cookie)
    } else if (init?.headers) {
      init.headers = { ...init.headers, cookie: this.cookie }
    } else if (init) {
      init.headers = { cookie: this.cookie }
    } else {
      init = { headers: { cookie: this.cookie } }
    }

    return fetch(url, init)
  }
}

export default VirtualBIT
