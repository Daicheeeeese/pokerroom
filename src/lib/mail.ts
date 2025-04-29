import nodemailer from 'nodemailer'

// メール送信用のトランスポーターを作成
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
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
  userEmail: string
  userName: string
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
  userEmail,
  userName,
  roomName,
  date,
  startTime,
  endTime,
  totalPrice,
}: ReservationEmailData) {
  if (!process.env.SMTP_FROM) {
    console.error('SMTP_FROMが設定されていません')
    throw new Error('メール送信に必要な設定が不足しています')
  }

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: '【PokerBase】ご予約を受け付けました',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${userName}様</h2>
        <p style="color: #666;">PokerBaseをご利用いただき、ありがとうございます。<br>
        以下の内容で予約を受け付けました。</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">予約内容</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;"><strong>ルーム：</strong>${roomName}</li>
            <li style="margin-bottom: 10px;"><strong>日付：</strong>${date}</li>
            <li style="margin-bottom: 10px;"><strong>時間：</strong>${startTime} 〜 ${endTime}</li>
            <li style="margin-bottom: 10px;"><strong>料金：</strong>¥${totalPrice.toLocaleString()}</li>
          </ul>
        </div>
        
        <p style="color: #666;">ご予約内容の確認・キャンセルは<a href="${process.env.NEXT_PUBLIC_BASE_URL}/reservations" style="color: #0066cc;">マイページ</a>から行えます。</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">※このメールは送信専用です。返信いただいてもお答えできません。</p>
      </div>
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
    console.log('ユーザー向けメールを送信します:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })
    const info = await transporter.sendMail(mailOptions)
    console.log('ユーザー向けメール送信完了:', info.messageId)
    
    // 管理者向けメール送信
    await sendAdminNotification({
      userName,
      roomName,
      date,
      startTime,
      endTime,
      totalPrice,
    })
  } catch (error) {
    console.error('メール送信エラー:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
      console.error('エラースタック:', error.stack)
      if ('code' in error && error.code === 'EAUTH') {
        console.error('認証エラー: SMTPの認証情報が正しく設定されているか確認してください')
      }
    }
    throw new Error('予約確認メールの送信に失敗しました')
  }
} 