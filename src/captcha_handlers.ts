/**
 * {@link CaptchaHandler}示例
 */

import { createWriteStream } from 'fs'
import inquirer from 'inquirer'
import terminalImage from 'terminal-image'
import { CaptchaHandler } from './webvpn.js'

export async function ask_from_command_line (message: string = "What's the captcha? (case-insensitive)"): Promise<string> {
  const answers = await inquirer.prompt([{
    type: 'input',
    name: 'captcha',
    message,
  }]) as { captcha: string }
  return answers.captcha
}

/**
 * 保存验证码图像到某处，让人用其他方法查看并识别
 * @param save_path 保存验证码图像的路径
 * @returns
 */
export function save_captcha_then_ask_from_command_line (save_path: string): CaptchaHandler {
  return async (response) => {
    response.body?.pipe(createWriteStream(save_path))
    return await ask_from_command_line(`Please check “${save_path}”. What's the captcha? (case-insensitive)`)
  }
}

/**
 * 直接将验证码粗糙显示到终端，让人识别
 * @param options [terminal-image](https://www.npmjs.com/package/terminal-image)的选项
 * @returns
 */
export function display_captcha_then_ask_from_command_line (options: {
  width?: string | number | undefined
  height?: string | number | undefined
  preserveAspectRatio?: boolean | undefined
} = {}): CaptchaHandler {
  return async (response) => {
    const buffer = Buffer.from(await response.arrayBuffer())
    console.log(await terminalImage.buffer(buffer, options))

    return await ask_from_command_line("What's the captcha above? (case-insensitive)")
  }
}
