export const metadata = {
  title: 'プライバシーポリシー | PokerRoom',
  description: 'PokerRoomのプライバシーポリシーです',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">プライバシーポリシー</h1>
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <p className="text-gray-600">最終更新日：2025年4月7日</p>

          <p className="text-gray-700">
            当サイトでは、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本ポリシーでは、収集する情報およびその利用目的について説明します。
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. 収集する情報</h2>
            <p className="text-gray-700 mb-2">当サイトでは、以下の情報を取得する場合があります。</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>お問い合わせフォーム等に入力されたお名前、メールアドレス</li>
              <li>アクセス解析（Google Analytics等）により取得されるIPアドレス、ブラウザ情報など</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. 利用目的</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>サイトの改善およびユーザー体験の向上</li>
              <li>お問い合わせ対応</li>
              <li>利用状況の統計分析</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. クッキー（Cookie）の使用</h2>
            <p className="text-gray-700">
              当サイトでは、アクセス解析やサービス向上のためにCookieを使用することがあります。Cookieの使用を希望しない場合は、ブラウザの設定により無効にすることができます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. 第三者提供</h2>
            <p className="text-gray-700">
              法令に基づく場合を除き、取得した個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. お問い合わせ</h2>
            <p className="text-gray-700">
              プライバシーポリシーに関するお問い合わせは、お問い合わせフォームよりお願いいたします。
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 