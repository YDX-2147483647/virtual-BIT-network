import { decrypt_URL, encrypt_URL } from './convert.js'
import { prepare, sign_in } from './webvpn.js'

export { decrypt_URL, encrypt_URL }

export class VirtualBIT {
  username: string
  password: string
  cookie: string | null

  constructor({ username, password }: { username: string; password: string }) {
    this.username = username
    this.password = password
    this.cookie = null
  }

  async sign_in() {
    const prep = await prepare()
    await sign_in({ username: this.username, password: this.password }, prep)
    this.cookie = prep.cookie
  }

  /**
   * 原始`fetch`的包装
   * @param original_url
   * @param original_init
   * @returns
   * 传入的 cookie 会丢失。
   */
  fetch(original_url: RequestInfo, original_init?: RequestInit | undefined): Promise<Response> {
    if (this.cookie === null) {
      throw new Error('Should sign in first.')
    }

    // 1. Encrypt the URL
    let url = original_url
    if (typeof url === 'string') {
      url = encrypt_URL(url)
    } else {
      // `Request` objects' properties are read only.
      url = new Request(encrypt_URL(url.url), url)
    }

    // 2. Add cookie
    if (typeof url !== 'string') {
      url.headers.set('cookie', this.cookie)
    }
    let init = original_init
    if (init?.headers) {
      const headers = new Headers(init.headers)
      headers.set('cookie', this.cookie)
      init.headers = headers
    } else if (init) {
      init.headers = { cookie: this.cookie }
    } else {
      init = { headers: { cookie: this.cookie } }
    }

    return fetch(url, init)
  }
}

export default VirtualBIT
