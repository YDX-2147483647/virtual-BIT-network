/**
 * {@link CaptchaHandler}示例
 */

import { createWriteStream } from 'fs'
import inquirer from 'inquirer'
import { CaptchaHandler } from './webvpn'

/**
 * @param save_path 保存验证码图像的路径
 * @returns
 */
export function save_captcha_then_ask_from_command_line (save_path: string): CaptchaHandler {
  return async (response) => {
    response.body?.pipe(createWriteStream(save_path))

    const answers = await inquirer.prompt([{
      type: 'input',
      name: 'captcha',
      message: `Please check “${save_path}”. What's the captcha? (case-insensitive)`,
    }]) as { captcha: string }
    return answers.captcha
  }
}
