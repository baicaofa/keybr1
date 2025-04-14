import { authenticate, request } from "@fastr/client";
import { injectable } from "@fastr/invert";
import { Env } from "@keybr/config";
import nodemailer from "nodemailer";
import { Mailer } from "./types.ts";

@injectable({ singleton: true })
export class MailgunConfig {
  readonly domain: string;
  readonly key: string;
  readonly from: string;

  constructor() {
    this.domain = Env.getString("MAIL_DOMAIN");
    this.key = Env.getString("MAIL_KEY");
    const fromAddress = Env.getString("MAIL_FROM_ADDRESS", "k@keybr.com");
    const fromName = Env.getString("MAIL_FROM_NAME", "keybr.com");
    this.from = `${fromName} <${fromAddress}>`;
  }
}

@injectable()
/* export class MailgunMailer extends Mailer {
  constructor(readonly config: MailgunConfig) {
    super();
  }

  async sendMail({
    from = this.config.from,
    to,
    subject,
    text,
    html,
  }: Mailer.Message): Promise<void> {
    const body = new URLSearchParams([
      ["from", from],
      ["to", to],
      ["subject", subject],
    ]);
    if (text) {
      body.append("text", text);
    }
    if (html) {
      body.append("html", html);
    }

    const response = await request
      .use(authenticate.basic("api", this.config.key))
      .POST(`https://api.mailgun.net/v3/${this.config.domain}/messages`)
      .send(body);

    if (response.ok) {
      const { id } = await response.body.json<{ id: string }>();
    } else {
      response.abort();
      throw new Error(
        `Unable to send email: ${response.status} ${response.statusText}`,
      );
    }
  }
} */
export class MailgunMailer extends Mailer {
  // 保持类名和函数名不变
  private transporter: nodemailer.Transporter;
  constructor() {
    super();
    // 使用 Gmail SMTP 服务器配置
    this.transporter = nodemailer.createTransport({
      service: "gmail", // 使用 Gmail 的 SMTP 服务
      auth: {
        user: Env.getString("GMAIL_USER"), // 从环境变量中读取 Gmail 地址
        pass: Env.getString("GMAIL_PASS"), // 从环境变量中读取应用专用密码
      },
    });
  }

  async sendMail({
    from = Env.getString("GMAIL_USER"), // 默认发件人
    to,
    subject,
    text,
    html,
  }: Mailer.Message): Promise<void> {
    // 构建邮件内容
    const mailOptions = {
      from, // 发件人
      to, // 收件人
      subject, // 邮件主题
      text, // 邮件文本内容
      html, // 邮件 HTML 内容
    };

    // 使用 Gmail SMTP 发送邮件
 
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
  } catch (error) {
      console.error("Error sending email:", error);
      if (error instanceof Error) { // 使用类型守卫判断是否为 Error 类型
          throw new Error(`Unable to send email: ${error.message}`);
      } else {
          // 如果不是 Error 类型，可以在这里进行更合适的兜底处理，比如记录日志并抛出一个通用的异常
          console.log("Caught an unexpected type of error:", error);
          throw new Error("An unexpected error occurred while sending email");
      }
  }




  }
}
