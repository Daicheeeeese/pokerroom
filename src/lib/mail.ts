import nodemailer from 'nodemailer'

// メール送信用のトランスポーターを作成
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

type ReservationEmailData = {
  userEmail: string
  userName: string
  roomName: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
}

export async function sendReservationConfirmationEmail({
  userEmail,
  userName,
  roomName,
  date,
  startTime,
  endTime,
  totalPrice,
}: ReservationEmailData) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: '【PokerRoom】ご予約を受け付けました',
    html: `
      <h2>${userName}様</h2>
      <p>PokerRoomをご利用いただき、ありがとうございます。<br>
      以下の内容で予約を受け付けました。</p>
      
      <h3>予約内容</h3>
      <ul>
        <li>ルーム：${roomName}</li>
        <li>日付：${date}</li>
        <li>時間：${startTime} 〜 ${endTime}</li>
        <li>料金：¥${totalPrice.toLocaleString()}</li>
      </ul>
      
      <p>ご予約内容の確認・キャンセルは<a href="${process.env.NEXT_PUBLIC_BASE_URL}/reservations">マイページ</a>から行えます。</p>
      
      <hr>
      <p>※このメールは送信専用です。返信いただいてもお答えできません。</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('メール送信エラー:', error)
    throw new Error('予約確認メールの送信に失敗しました')
  }
} 