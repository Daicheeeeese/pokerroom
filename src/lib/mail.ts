import nodemailer from 'nodemailer'

// メール送信用のトランスポーターを作成
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // TLSを使用
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // SPF、DKIM、DMARCの設定
  dkim: {
    domainName: process.env.MAIL_DOMAIN,
    keySelector: 'default',
    privateKey: process.env.DKIM_PRIVATE_KEY,
  },
} as nodemailer.TransportOptions)

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
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: 'pokerroom.reservation@gmail.com',
    subject: '【PokerRoom】新規予約が入りました',
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
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('管理者向けメール送信エラー:', error)
    // 管理者向けメールの失敗は予約プロセスを中断しない
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
  const mailOptions: nodemailer.SendMailOptions = {
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
    // メールの優先度を設定
    priority: 'high' as const,
    // メールの分類を設定
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
    },
  }

  try {
    // ユーザー向けメール送信
    await transporter.sendMail(mailOptions)
    
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
    throw new Error('予約確認メールの送信に失敗しました')
  }
} 