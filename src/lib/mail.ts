import nodemailer from 'nodemailer'

// メール送信用のトランスポーターを作成
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// トランスポーターの接続を確認
transporter.verify(function(error, success) {
  if (error) {
    console.error('メールサーバー接続エラー:', error)
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
  const mailOptions = {
    from: process.env.GMAIL_USER,
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
    console.log('管理者向けメールを送信します:', mailOptions)
    const info = await transporter.sendMail(mailOptions)
    console.log('管理者向けメール送信完了:', info.messageId)
  } catch (error) {
    console.error('管理者向けメール送信エラー:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
      console.error('エラースタック:', error.stack)
    }
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
  const mailOptions = {
    from: process.env.GMAIL_USER,
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
    console.log('ユーザー向けメールを送信します:', mailOptions)
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
    }
    throw new Error('予約確認メールの送信に失敗しました')
  }
} 