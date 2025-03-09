import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // バリデーション
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      )
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "メールアドレスの形式が正しくありません" },
        { status: 400 }
      )
    }

    // パスワードの長さチェック
    if (password.length < 8) {
      return NextResponse.json(
        { error: "パスワードは8文字以上で入力してください" },
        { status: 400 }
      )
    }

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 400 }
      )
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    console.log("新規ユーザー登録:", {
      id: user.id,
      email: user.email,
      name: user.name,
    })

    return NextResponse.json(
      { message: "ユーザー登録が完了しました" },
      { status: 201 }
    )
  } catch (error) {
    console.error("ユーザー登録エラー:", error)
    return NextResponse.json(
      { error: "ユーザー登録に失敗しました" },
      { status: 500 }
    )
  }
} 