import { createTransport } from 'nodemailer'

// メール送信用のトランスポーターを作成
const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// トランスポーターの接続を確認
transporter.verify(function(error, success) {
  if (error) {
    console.error('メールサーバー接続エラー:', error)
    if ('code' in error && error.code === 'EAUTH') {
      console.error('認証エラー: SMTPの認証情報が正しく設定されているか確認してください')
    }
  } else {
    console.log('メールサーバーに接続しました')
  }
})

type ReservationEmailData = {
  email: string
  name: string
  reservationCode: string
  roomName: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
}

// 管理者向けメール送信
async function sendAdminNotification({
  userName,
  roomName,
  date,
  startTime,
  endTime,
  totalPrice,
}: Omit<ReservationEmailData, 'userEmail'>) {
  if (!process.env.SMTP_FROM) {
    console.error('SMTP_FROMが設定されていません')
    return
  }

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.SMTP_FROM,
    to: 'pokerroom.reservation@gmail.com',
    subject: '【PokerBase】新規予約が入りました',
    html: `
      <h2>新規予約通知</h2>
      <p>以下の予約が入りました。</p>
      
      <h3>予約内容</h3>
      <ul>
        <li>予約者：${userName}</li>
        <li>ルーム：${roomName}</li>
        <li>利用日：${date}</li>
        <li>利用時間：${startTime} 〜 ${endTime}</li>
        <li>合計金額：¥${totalPrice.toLocaleString()}</li>
      </ul>
      
      <p>予約の詳細は<a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/reservations">管理画面</a>から確認できます。</p>
    `,
    priority: 'high' as const,
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
      'List-Unsubscribe': `<mailto:${process.env.SMTP_USER}?subject=unsubscribe>`,
    },
  }

  try {
    console.log('管理者向けメールを送信します:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })
    const info = await transporter.sendMail(mailOptions)
    console.log('管理者向けメール送信完了:', info.messageId)
  } catch (error) {
    console.error('管理者向けメール送信エラー:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
      console.error('エラースタック:', error.stack)
      if ('code' in error && error.code === 'EAUTH') {
        console.error('認証エラー: SMTPの認証情報が正しく設定されているか確認してください')
      }
    }
  }
}

export async function sendReservationConfirmationEmail({
  email,
  name,
  reservationCode,
  roomName,
  date,
  startTime,
  endTime,
  totalPrice,
}: ReservationEmailData) {
  const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reservations/check`
  
  const content = `
    予約が完了しました。
    
    予約番号: ${reservationCode}
    施設名: ${roomName}
    日付: ${date}
    時間: ${startTime} - ${endTime}
    料金: ¥${totalPrice.toLocaleString()}
    
    予約の確認・キャンセルは以下のURLから行えます：
    ${confirmationUrl}
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: '予約完了のお知らせ',
    text: content,
  })

  // 管理者向けメール送信
  await sendAdminNotification({
    userName: name,
    roomName,
    date,
    startTime,
    endTime,
    totalPrice,
  })
}

type CancellationEmailData = {
  email: string
  name: string
  reservationCode: string
  date: string
  startTime: string
  endTime: string
}

export async function sendCancellationEmail({
  email,
  name,
  reservationCode,
  date,
  startTime,
  endTime,
}: CancellationEmailData) {
  const content = `
    予約のキャンセルが完了しました。
    
    予約番号: ${reservationCode}
    日付: ${date}
    時間: ${startTime} - ${endTime}
    
    ご利用ありがとうございました。
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: '予約キャンセルのお知らせ',
    text: content,
  })
} 