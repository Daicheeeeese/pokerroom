export const metadata = {
  title: '利用規約 | PokerRoom',
  description: 'PokerRoomの利用規約です',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">利用規約</h1>
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <p className="text-gray-600">最終更新日：2025年4月7日</p>

          <p className="text-gray-700">
            このウェブサイト（以下、「当サイト」）は、ポーカールームの情報提供および検索サービスを提供する目的で運営されています。当サイトを利用される際は、以下の利用規約に同意したものとみなされます。
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. サービスの内容</h2>
            <p className="text-gray-700">
              当サイトは、ポーカールームの情報を掲載し、ユーザーが検索・閲覧できる機能を提供しています。情報の正確性や完全性については万全を期していますが、保証するものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. 禁止事項</h2>
            <p className="text-gray-700 mb-2">以下の行為は禁止します。</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>虚偽の情報の登録・送信</li>
              <li>当サイトの運営を妨害する行為</li>
              <li>他のユーザーまたは第三者の権利を侵害する行為</li>
              <li>法令または公序良俗に反する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. 免責事項</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>掲載情報の内容やリンク先の外部サイトの内容について、一切の責任を負いません。</li>
              <li>サイトの機能停止、変更、またはサービスの中断により生じた損害についても責任を負いません。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. 規約の変更</h2>
            <p className="text-gray-700">
              当サイトは、利用者への事前通知なしに本規約を変更できるものとします。変更後の規約は、当サイトに掲載された時点で効力を持ちます。
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 