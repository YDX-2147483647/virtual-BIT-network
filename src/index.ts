import {
  ask_from_command_line,
  display_captcha_then_ask_from_command_line,
  save_captcha_then_ask_from_command_line,
} from './captcha_handlers.js'
export { decrypt_URL, encrypt_URL } from './convert.js'
export { CaptchaHandler, Preparation, prepare, sign_in } from './webvpn.js'

export const cli = {
  ask_from_command_line,
  save_captcha_then_ask_from_command_line,
  display_captcha_then_ask_from_command_line,
}
