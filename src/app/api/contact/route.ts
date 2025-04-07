import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // メール送信の設定
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // メール本文の作成
    const mailBody = `
お問い合わせがありました。

【お名前】
${name}

【メールアドレス】
${email}

【お問い合わせ内容】
${message}
    `

    // メール送信
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'pokerroom.reservation@gmail.com',
      subject: '【PokerRoom】お問い合わせがありました',
      text: mailBody,
    })

    return NextResponse.json({ message: '送信成功' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'メール送信に失敗しました' },
      { status: 500 }
    )
  }
} 